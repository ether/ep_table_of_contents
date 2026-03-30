const {expect, test} = require('@playwright/test');
const {
  clearPadContent,
  getPadBody,
  goToNewPad,
  writeToPad,
} = require('ep_etherpad-lite/tests/frontend-new/helper/padHelper');

const enableToc = async (page) => {
  await page.locator('.buttonicon-settings').click();
  await page.locator('label[for="options-toc"]').click();
  await expect(page.locator('#toc')).toBeVisible();
};

const writeSections = async (page, count, prefix) => {
  for (let i = 0; i < count; i++) {
    await writeToPad(page, `${prefix} ${i + 1}`);
    if (i < count - 1) await page.keyboard.press('Enter');
  }
};

const applyHeading = async (page, lineNumber, headingLevel) => {
  const padBody = await getPadBody(page);
  await padBody.locator('div').nth(lineNumber).selectText();
  await page.evaluate((value) => {
    $('#heading-selection').val(String(value)).trigger('change');
  }, headingLevel - 1);
};

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
  await enableToc(page);
  await clearPadContent(page);
});

test.describe('table of contents numbering', () => {
  test('starts sibling h2 headings at 1 when there is no h1', async ({page}) => {
    await writeToPad(page, 'First section');
    await page.keyboard.press('Enter');
    await writeToPad(page, 'Second section');

    await applyHeading(page, 0, 2);
    await applyHeading(page, 1, 2);

    const tocItems = page.locator('#tocItems .tocItem');
    await expect(tocItems).toHaveCount(2);
    await expect(tocItems.nth(0)).toHaveText('1. First section');
    await expect(tocItems.nth(1)).toHaveText('2. Second section');
  });

  test('keeps a single top-level heading unnumbered and starts children at 1', async ({page}) => {
    await writeToPad(page, 'Document title');
    await page.keyboard.press('Enter');
    await writeToPad(page, 'First section');
    await page.keyboard.press('Enter');
    await writeToPad(page, 'Second section');

    await applyHeading(page, 0, 1);
    await applyHeading(page, 1, 2);
    await applyHeading(page, 2, 2);

    const tocItems = page.locator('#tocItems .tocItem');
    await expect(tocItems).toHaveCount(3);
    await expect(tocItems.nth(0)).toHaveText('Document title');
    await expect(tocItems.nth(1)).toHaveText('1. First section');
    await expect(tocItems.nth(2)).toHaveText('2. Second section');
  });

  test('keeps all TOC entries for larger sets of sibling headings', async ({page}) => {
    const headingCount = 25;
    await writeSections(page, headingCount, 'Section');

    const tocItems = page.locator('#tocItems .tocItem');
    for (let i = 0; i < headingCount; i++) {
      await applyHeading(page, i, 2);
      await expect(page.locator(`#tocItems .tocItem[title="Section ${i + 1}"]`)).toBeVisible({timeout: 15_000});
    }

    await expect(tocItems).toHaveCount(headingCount);
    await expect(tocItems.nth(0)).toHaveText('1. Section 1');
    await expect(tocItems.nth(9)).toHaveText('10. Section 10');
    await expect(tocItems.nth(24)).toHaveText('25. Section 25');
  });
});
