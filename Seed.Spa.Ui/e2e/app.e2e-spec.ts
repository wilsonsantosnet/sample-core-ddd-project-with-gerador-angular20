import { Target.Pendencias.Spa.Ui.V3Page } from './app.po';

describe('target.pendencias.spa.ui.v3 App', () => {
  let page: Target.Pendencias.Spa.Ui.V3Page;

  beforeEach(() => {
    page = new Target.Pendencias.Spa.Ui.V3Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
