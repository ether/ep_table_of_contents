import {expect, test} from '@playwright/test';
import {goToNewPad} from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

const enableToc = async (page) => {
  await page.locator('.buttonicon-settings').click();
  await page.locator('label[for="options-toc"]').click();
  await expect(page.locator('#toc')).toBeVisible();
};

const enableFullWidthEditor = async (page) => {
  await page.evaluate(() => {
    const outer = $('iframe[name="ace_outer"]').contents();
    const inner = outer.find('iframe[name="ace_inner"]').contents();
    $('html').addClass('full-width-editor');
    outer.find('html').addClass('full-width-editor');
    inner.find('html').addClass('full-width-editor');
  });
};

test('TOC does not consume quarter-width in full-width-editor mode', async ({page}) => {
  await page.setViewportSize({width: 1600, height: 900});
  await goToNewPad(page);
  await enableFullWidthEditor(page);
  await enableToc(page);

  const tocWidth = await page.locator('#toc').evaluate((el) => Math.round(el.getBoundingClientRect().width));
  expect(tocWidth).toBeLessThan(260);
});
