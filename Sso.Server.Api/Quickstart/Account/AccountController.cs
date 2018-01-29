// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using IdentityModel;
using IdentityServer4.Services;
using IdentityServer4.Stores;
using IdentityServer4.Test;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using IdentityServer4.Events;
using IdentityServer4.Extensions;
using Sso.Server.Api;
using Sso.Server.Api.Model;
using Common.Domain.Base;
using Microsoft.Extensions.Options;

namespace IdentityServer4.Quickstart.UI
{
    /// <summary>
    /// This sample controller implements a typical login/logout/provision workflow for local and external accounts.
    /// The login service encapsulates the interactions with the user data store. This data store is in-memory only and cannot be used for production!
    /// The interaction service provides a way for the UI to communicate with identityserver for validation and context retrieval
    /// </summary>
    [SecurityHeaders]
    public class AccountController : Controller
    {
        private readonly UserServices _usersServices;
        private readonly TestUserStore _users;
        private readonly IIdentityServerInteractionService _interaction;
        private readonly IEventService _events;
        private readonly AccountService _account;
        private readonly IOptions<ConfigSettingsBase> _settings;
        private readonly IOptions<ConfigEmailBase> _configEmail;


        public AccountController(
            IIdentityServerInteractionService interaction,
            IClientStore clientStore,
            IHttpContextAccessor httpContextAccessor,
            IEventService events,
            IOptions<ConfigSettingsBase> settings,
            IOptions<ConfigEmailBase> configEmail,

            TestUserStore users = null)
        {
            // if the TestUserStore is not in DI, then we'll just use the global users collection
            _users = users ?? new TestUserStore(TestUsers.Users);
            _usersServices = new UserServices();
            _interaction = interaction;
            _events = events;
            _settings = settings;
            _configEmail = configEmail;
            _account = new AccountService(interaction, httpContextAccessor, clientStore);
            
        }

        /// <summary>
        /// Show login page
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Login(string returnUrl)
        {
            var vm = await _account.BuildLoginViewModelAsync(returnUrl);

            if (vm.IsExternalLoginOnly)
            {
                // only one option for logging in
                return await ExternalLogin(vm.ExternalLoginScheme, returnUrl);
            }

            return View(vm);
        }

        /// <summary>
        /// Handle postback from username/password login
        /// </summary>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginInputModel model)
        {
            if (ModelState.IsValid)
            {
                model.RememberLogin = true;
                // validate username/password against in-memory store
                var user = await _usersServices.Auth(model.Username, model.Password);
                if (user.IsNotNull())
                {
                    AuthenticationProperties props = null;
                    // only set explicit expiration here if persistent. 
                    // otherwise we reply upon expiration configured in cookie middleware.
                    if (AccountOptions.AllowRememberLogin && model.RememberLogin)
                    {
                        props = new AuthenticationProperties
                        {
                            IsPersistent = true,
                            ExpiresUtc = DateTimeOffset.UtcNow.Add(AccountOptions.RememberMeLoginDuration)
                        };
                    };

                    // issue authentication cookie with subject ID and username
                    //var user = _users.FindByUsername(model.Username);
                    await _events.RaiseAsync(new UserLoginSuccessEvent(user.Username, user.SubjectId, user.Username));
                    await HttpContext.Authentication.SignInAsync(user.SubjectId, user.Username, user.Claims.ToArray());

                    // make sure the returnUrl is still valid, and if yes - redirect back to authorize endpoint or a local page
                    if (_interaction.IsValidReturnUrl(model.ReturnUrl) || Url.IsLocalUrl(model.ReturnUrl))
                    {
                        return Redirect(model.ReturnUrl);
                    }

                    return Redirect("~/");
                }

                await _events.RaiseAsync(new UserLoginFailureEvent(model.Username, "invalid credentials"));

                ModelState.AddModelError("", AccountOptions.InvalidCredentialsErrorMessage);
            }

            // something went wrong, show form with error
            var vm = await _account.BuildLoginViewModelAsync(model);
            return View(vm);
        }

        /// <summary>
        /// initiate roundtrip to external authentication provider
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> ExternalLogin(string provider, string returnUrl)
        {
            returnUrl = Url.Action("ExternalLoginCallback", new { returnUrl = returnUrl });

            // windows authentication is modeled as external in the asp.net core authentication manager, so we need special handling
            if (AccountOptions.WindowsAuthenticationSchemes.Contains(provider))
            {
                // but they don't support the redirect uri, so this URL is re-triggered when we call challenge
                if (HttpContext.User is WindowsPrincipal wp)
                {
                    var props = new AuthenticationProperties();
                    props.Items.Add("scheme", AccountOptions.WindowsAuthenticationProviderName);

                    var id = new ClaimsIdentity(provider);
                    id.AddClaim(new Claim(JwtClaimTypes.Subject, HttpContext.User.Identity.Name));
                    id.AddClaim(new Claim(JwtClaimTypes.Name, HttpContext.User.Identity.Name));

                    // add the groups as claims -- be careful if the number of groups is too large
                    if (AccountOptions.IncludeWindowsGroups)
                    {
                        var wi = wp.Identity as WindowsIdentity;
                        var groups = wi.Groups.Translate(typeof(NTAccount));
                        var roles = groups.Select(x => new Claim(JwtClaimTypes.Role, x.Value));
                        id.AddClaims(roles);
                    }

                    await HttpContext.Authentication.SignInAsync(IdentityServer4.IdentityServerConstants.ExternalCookieAuthenticationScheme, new ClaimsPrincipal(id), props);
                    return Redirect(returnUrl);
                }
                else
                {
                    // this triggers all of the windows auth schemes we're supporting so the browser can use what it supports
                    return new ChallengeResult(AccountOptions.WindowsAuthenticationSchemes);
                }
            }
            else
            {
                // start challenge and roundtrip the return URL
                var props = new AuthenticationProperties
                {
                    RedirectUri = returnUrl,
                    Items = { { "scheme", provider } }
                };
                return new ChallengeResult(provider, props);
            }
        }

        /// <summary>
        /// Post processing of external authentication
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> ExternalLoginCallback(string returnUrl)
        {
            // read external identity from the temporary cookie
            var info = await HttpContext.Authentication.GetAuthenticateInfoAsync(IdentityServer4.IdentityServerConstants.ExternalCookieAuthenticationScheme);
            var tempUser = info?.Principal;
            if (tempUser == null)
            {
                throw new Exception("External authentication error");
            }

            // retrieve claims of the external user
            var claims = tempUser.Claims.ToList();

            // try to determine the unique id of the external user - the most common claim type for that are the sub claim and the NameIdentifier
            // depending on the external provider, some other claim type might be used
            var userIdClaim = claims.FirstOrDefault(x => x.Type == JwtClaimTypes.Subject);
            if (userIdClaim == null)
            {
                userIdClaim = claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);
            }
            if (userIdClaim == null)
            {
                throw new Exception("Unknown userid");
            }

            // remove the user id claim from the claims collection and move to the userId property
            // also set the name of the external authentication provider
            claims.Remove(userIdClaim);
            var provider = info.Properties.Items["scheme"];
            var userId = userIdClaim.Value;

            // check if the external user is already provisioned
            var _user = _users.FindByExternalProvider(provider, userId);
            if (_user == null)
            {
                // this sample simply auto-provisions new external user
                // another common approach is to start a registrations workflow first
                _user = _users.AutoProvisionUser(provider, userId, claims);
            }

            var user = new User() { Username = _user.Username, SubjectId = _user.SubjectId };
            var additionalClaims = new List<Claim>();

            //External 
            //var tenant = await this._usersServices.AuthByExternalLogin(claims);
            //if (tenant.Claims.IsAny())
            //{
            //    foreach (var item in tenant.Claims)
            //        additionalClaims.Add(new Claim(item.Type, item.Value));

            //    user.Username = tenant.Username;
            //    user.SubjectId = tenant.SubjectId;
            //}

            // if the external system sent a session id claim, copy it over
            var sid = claims.FirstOrDefault(x => x.Type == JwtClaimTypes.SessionId);
            if (sid != null)
            {
                additionalClaims.Add(new Claim(JwtClaimTypes.SessionId, sid.Value));
            }

            // if the external provider issued an id_token, we'll keep it for signout
            AuthenticationProperties props = null;
            var id_token = info.Properties.GetTokenValue("id_token");
            if (id_token != null)
            {
                props = new AuthenticationProperties();
                props.StoreTokens(new[] { new AuthenticationToken { Name = "id_token", Value = id_token } });
            }

            // issue authentication cookie for user
            await _events.RaiseAsync(new UserLoginSuccessEvent(provider, userId, user.SubjectId, user.Username));
            await HttpContext.Authentication.SignInAsync(user.SubjectId, user.Username, provider, props, additionalClaims.ToArray());

            // delete temporary cookie used during external authentication
            await HttpContext.Authentication.SignOutAsync(IdentityServer4.IdentityServerConstants.ExternalCookieAuthenticationScheme);

            // validate return URL and redirect back to authorization endpoint or a local page
            if (_interaction.IsValidReturnUrl(returnUrl) || Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }

            return Redirect("~/");
        }

        /// <summary>
        /// Show logout page
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Logout(string logoutId, string returnUrl)
        {
            var vm = await _account.BuildLogoutViewModelAsync(logoutId);
            vm.ReturnUrl = returnUrl;

            if (vm.ShowLogoutPrompt == false)
            {
                // no need to show prompt
                return await Logout(vm);
            }

            return View(vm);
        }

        /// <summary>
        /// Handle logout page postback
        /// </summary>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout(LogoutInputModel model)
        {
            var vm = await _account.BuildLoggedOutViewModelAsync(model.LogoutId);
            if (vm.TriggerExternalSignout)
            {
                string url = Url.Action("Logout", new { logoutId = vm.LogoutId });
                try
                {
                    // hack: try/catch to handle social providers that throw
                    await HttpContext.Authentication.SignOutAsync(vm.ExternalAuthenticationScheme,
                        new AuthenticationProperties { RedirectUri = url });
                }
                catch (NotSupportedException) // this is for the external providers that don't have signout
                {
                }
                catch (InvalidOperationException) // this is for Windows/Negotiate
                {
                }
            }

            // delete local authentication cookie
            await HttpContext.Authentication.SignOutAsync();

            var user = await HttpContext.GetIdentityServerUserAsync();
            if (user != null)
            {
                await _events.RaiseAsync(new UserLogoutSuccessEvent(user.GetSubjectId(), user.GetName()));
            }

            if (model.ReturnUrl != null)
                return Redirect(model.ReturnUrl);

            return View("LoggedOut", vm);
        }

        ///// <summary>
        ///// ForgottenPassword
        ///// </summary>
        //[HttpGet]
        //public async Task<IActionResult> ForgottenPassword()
        //{
        //    return await Task.Run(() => { return View(); });
        //}

        //[HttpPost]
        //public async Task<IActionResult> ForgottenPassword(string Email)
        //{
        //    var userEmail = await this._rep.SingleOrDefaultAsync(this._rep.GetAll().Where(_ => _.Email == Email));
        //    if (userEmail.IsNotNull())
        //    {
        //        var guid = Guid.NewGuid();
        //        var content = "<a href='" + this._settings.Value.AuthorityEndPoint + "/account/ForgottenPasswordReset/" + guid.ToString() + "'>Redefinir senha</a>";

        //        var email = new Common.Mail.Email();

        //        email.Config(this._configEmail.Value.SmtpServer, this._configEmail.Value.SmtpUser, this._configEmail.Value.SmtpPassword);
        //        email.AddAddressFrom(this._configEmail.Value.FromText, this._configEmail.Value.FromEmail);

        //        //email.AddAddressFrom("suporte", "suporte@cnabox.com.br");
        //        //email.Config("smtplw.com.br", "dmts", "ttxteKBf3912");
        //        //email.AddAddressFrom("suporte", "suporte@cnabox.com.br");
        //        email.AddAddressTo(Email, Email);
        //        email.Send("Resetar senha", content);

        //        userEmail.SetarGuidResetPassword(guid);
        //        userEmail.SetarDateResetPassword(DateTime.Now);

        //        this._rep.Update(userEmail);
        //        await this._rep.CommitAsync();

        //        return View("ForgottenPasswordSucess");
        //    }

        //    return View("ForgottenPasswordError");
        //}


        //[HttpGet]
        //public async Task<IActionResult> ForgottenPasswordReset(string Id)
        //{
        //    var userGuid = await this._rep.SingleOrDefaultAsync(this._rep.GetAll().Where(_ => _.GuidResetPassword == Guid.Parse(Id)));
        //    if (userGuid.IsNotNull())
        //    {
        //        var tempoDescorrido = DateTime.Now.Subtract(userGuid.DateResetPassword.Value).Minutes;
        //        if (tempoDescorrido <= 60)
        //            return View("ForgottenPasswordReset", Id);
        //    }
        //    return View("ForgottenPasswordErrorGuid");
        //}


        //[HttpPost]
        //public async Task<IActionResult> ForgottenPasswordReset(string guid, string newPassword, string newConfPassword)
        //{
        //    var userGuid = await this._rep.SingleOrDefaultAsync(this._rep.GetAll().Where(_ => _.GuidResetPassword == Guid.Parse(guid)));
        //    if (userGuid.IsNotNull())
        //    {
        //        var tempoDescorrido = DateTime.Now.Subtract(userGuid.DateResetPassword.Value).Minutes;
        //        if (tempoDescorrido <= 60)
        //        {
        //            if (newPassword == newConfPassword)
        //            {
        //                userGuid.RedefinirPassword(newPassword);
        //                this._rep.Update(userGuid);
        //                await this._rep.CommitAsync();

        //                return View("ForgottenPasswordResetSuccess");
        //            }
        //            else
        //            {
        //                return View("ForgottenPasswordErrorPassword");
        //            }

        //        }
        //    }
        //    return View("ForgottenPasswordErrorGuid");
        //}

        [HttpGet]
        public async Task<IActionResult> ComeBackApp()
        {
            return await Task.Run(() => { return Redirect(this._settings.Value.PostLogoutRedirectUris); });
        }
    }
}