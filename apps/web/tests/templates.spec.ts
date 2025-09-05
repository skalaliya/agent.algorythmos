import { test, expect } from "@playwright/test";

test("Templates gallery and detail", async ({ page }) => {
  await page.goto("/templates");
  await expect(page.getByRole("heading", { name: "Templates" })).toBeVisible();
  
  // Test template gallery
  const templateCards = page.locator('[href*="/templates/"]');
  await expect(templateCards).toHaveCount(5); // We have 5 templates
  
  // Click on Demo Request Qualifier template
  await page.getByRole("link", { name: /Demo Request Qualifier/i }).click();
  await expect(page.getByRole("heading", { name: /Demo Request Qualifier/i })).toBeVisible();
  
  // Test template detail page elements
  await expect(page.getByText("Automatically qualify sales demo requests")).toBeVisible();
  await expect(page.getByText("Steps in this workflow")).toBeVisible();
  
  // Test "Use this template" button
  await page.getByRole("link", { name: /Use this template/i }).click();
  await expect(page).toHaveURL(/workflows\/new\?template=demo-request-qualifier-hubspot/);
  
  // Test workflow creation page
  await expect(page.getByText("Create workflow")).toBeVisible();
  await expect(page.getByText("Prefilled from template")).toBeVisible();
});

test("Template 404 handling", async ({ page }) => {
  // Test non-existent template
  await page.goto("/templates/non-existent-template");
  await expect(page.getByText("404")).toBeVisible();
});

test("Template navigation", async ({ page }) => {
  await page.goto("/");
  
  // Test navbar templates link
  await page.getByRole("link", { name: "Templates" }).click();
  await expect(page).toHaveURL("/templates");
  
  // Test back navigation from template detail
  await page.getByRole("link", { name: /Demo Request Qualifier/i }).click();
  await page.getByRole("link", { name: "← All templates" }).click();
  await expect(page).toHaveURL("/templates");
});
