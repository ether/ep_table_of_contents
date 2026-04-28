import {expect, test} from '@playwright/test';
import {goToNewPad} from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

test.describe('ep_table_of_contents', () => {
  test('plugin is loaded and exposes itself in clientVars', async ({page}) => {
    const enabled = await page.evaluate(
      () => (window as any).clientVars?.plugins?.plugins?.ep_table_of_contents != null);
    expect(enabled).toBe(true);
  });

  test('TOC sidebar element is rendered into the pad', async ({page}) => {
    // The eejsBlock_editorContainerBox hook injects templates/toc.ejs
    // (the #toc + #tocItems container) into the pad's editor box.
    await expect(page.locator('#toc')).toBeAttached();
    await expect(page.locator('#tocItems')).toBeAttached();
  });

  test('toolbar TOC toggle button is present', async ({page}) => {
    // The eejsBlock_editbarMenuRight hook injects templates/barButton.ejs
    // — the toolbar entry that toggles the TOC sidebar visibility.
    await expect(page.locator('#ep_table_of_contents-a')).toBeAttached();
  });
});
