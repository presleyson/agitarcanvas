import { expect, test } from '@playwright/test';
import { addNote, createProject, expectNoHorizontalOverflow, expectSaved } from './helpers';

test.describe('Identidade v3', () => {
  test('alterna o tema e mantém a escolha depois de recarregar', async ({ page }) => {
    await page.goto('./#/projetos');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'light');

    await page.getByRole('button', { name: 'Usar tema escuro' }).click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    // O fundo muda com transição; aguarda o valor final.
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
      .toBe('rgb(12, 14, 19)');

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await page.getByRole('button', { name: 'Usar tema claro' }).click();
    await expect(html).toHaveAttribute('data-theme', 'light');
  });

  test('filtra por status e usa os atalhos de teclado', async ({ page }) => {
    await createProject(page, 'Projeto Rascunho');
    await createProject(page, 'Projeto Concluído');
    await page.goto('./#/projetos');
    await page.getByRole('button', { name: 'Ações do projeto Projeto Concluído' }).click();
    await page.getByRole('menuitem', { name: 'Editar dados' }).click();
    await page.getByLabel('Status', { exact: true }).selectOption('done');
    await page.getByRole('button', { name: 'Salvar alterações' }).click();

    const names = page.locator('article h2');
    const filters = page.getByRole('group', { name: 'Filtrar por status' });
    await filters.getByRole('button', { name: /Concluído/ }).click();
    await expect(names).toHaveText(['Projeto Concluído']);
    await filters.getByRole('button', { name: /Em andamento/ }).click();
    await expect(page.getByText('Nenhum projeto nesta situação')).toBeVisible();
    await page.getByRole('button', { name: 'Limpar filtros' }).click();
    await expect(names).toHaveCount(2);

    // "/" leva à pesquisa; dentro do campo, "n" é texto e não abre o diálogo.
    await page.locator('body').click({ position: { x: 5, y: 300 } });
    await page.keyboard.press('/');
    await expect(page.getByPlaceholder(/Pesquisar/)).toBeFocused();
    await page.keyboard.type('n');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await page.getByPlaceholder(/Pesquisar/).fill('');

    await page.locator('body').click({ position: { x: 5, y: 300 } });
    await page.keyboard.press('n');
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByLabel('Nome do projeto')).toBeVisible();
  });

  test('o atalho Próxima etapa abre o projeto na etapa pendente @essencial', async ({ page }) => {
    await createProject(page, 'Projeto em Etapas');
    await addNote(page, 'planejamento', 'Crescer em serviços digitais');
    await expectSaved(page);
    await page.goto('./#/projetos');

    const next = page.getByRole('link', { name: /Continuar Projeto em Etapas: próxima etapa 2/ });
    await expect(next).toBeVisible();
    await next.click();

    await expect(page).toHaveURL(/etapa=/);
    const current = page.getByRole('navigation', { name: 'Etapas do canvas' }).locator('[aria-current="step"]');
    await expect(current).toHaveCount(1);
    await expect(current).toContainText('2');
  });

  test('o aviso de modo local pode ser dispensado', async ({ page }) => {
    await page.goto('./#/projetos');
    await expect(page.getByText('Modo local.')).toBeVisible();
    await page.getByRole('button', { name: 'Dispensar aviso' }).click();
    await expect(page.getByText('Modo local.')).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Meus Projetos' })).toBeVisible();
    await expect(page.getByText('Modo local.')).toHaveCount(0);
  });

  test('a lista com filtros não rola na horizontal @responsivo', async ({ page }) => {
    await createProject(page, 'Projeto com nome comprido para testar a largura do cartão', { organization: 'Organização de exemplo' });
    await createProject(page, 'Segundo projeto');
    await page.goto('./#/projetos');
    await expect(page.getByRole('group', { name: 'Filtrar por status' })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
