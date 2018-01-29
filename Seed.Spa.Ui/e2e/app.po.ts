import { browser, by, element } from 'protractor';

export class Target.Pendencias.Spa.Ui.V3Page {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
