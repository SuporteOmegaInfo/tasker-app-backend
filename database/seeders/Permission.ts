import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Permission.createMany([
      {
        name: 'Master',
        slug: 'master',
        hide_admin: true,
        hide_client: true
      },
      //Usuários
      {
        name: 'Visualizar Usuários',
        slug: 'visualizar-usuarios'
      },
      {
        name: 'Criar Usuários',
        slug: 'criar-usuarios'
      },
      {
        name: 'Editar Usuários',
        slug: 'editar-usuarios'
      },
      {
        name: 'Deletar Usuários',
        slug: 'deletar-usuarios'
      },
      // Departamentos
      {
        name: 'Visualizar Departamentos',
        slug: 'visualizar-departamentos',
        hide_client: true
      },
      {
        name: 'Criar Departamentos',
        slug: 'criar-departamentos',
        hide_client: true,
      },
      {
        name: 'Editar Departamentos',
        slug: 'editar-departamentos',
        hide_client: true,
      },
      {
        name: 'Deletar Departamentos',
        slug: 'deletar-departamentos',
        hide_client: true,
      },
      // Perfis - Categorias de acesso que podem ser adicionadas a departamentos
      {
        name: 'Visualizar Perfis',
        slug: 'visualizar-perfis',
        hide_client: true,
      },
      {
        name: 'Criar Perfis',
        slug: 'criar-perfis',
        hide_client: true,
      },
      {
        name: 'Editar Perfis',
        slug: 'editar-perfis',
        hide_client: true,
      },
      {
        name: 'Deletar Perfis',
        slug: 'deletar-perfis',
        hide_client: true,
      },
      // Permissões
      {
        name: 'Visualizar Permissões',
        slug: 'visualizar-permissoes',
        hide_admin: true,
        hide_client: true,
      },
      {
        name: 'Criar Permissões',
        slug: 'criar-permissoes',
        hide_admin: true,
        hide_client: true,
      },
      {
        name: 'Editar Permissões',
        slug: 'editar-permissoes',
        hide_admin: true,
        hide_client: true,
      },
      {
        name: 'Deletar Permissões',
        slug: 'deletar-permissoes',
        hide_admin: true,
        hide_client: true,
      },
      // Unidades
      {
        name: 'Visualizar Unidades',
        slug: 'visualizar-unidades',
        hide_client: true,
      },
      {
        name: 'Criar Unidades',
        slug: 'criar-unidades',
        hide_client: true,
      },
      {
        name: 'Editar Unidades',
        slug: 'editar-unidades',
        hide_client: true,
      },
      {
        name: 'Deletar Unidades',
        slug: 'deletar-unidades',
        hide_client: true,
      },
      // Projetos
      {
        name: 'Visualizar Projetos',
        slug: 'visualizar-projetos',
        hide_client: true,
      },
      {
        name: 'Criar Projetos',
        slug: 'criar-projetos',
        hide_client: true,
      },
      {
        name: 'Editar Projetos',
        slug: 'editar-projetos',
        hide_client: true,
      },
      {
        name: 'Deletar Projetos',
        slug: 'deletar-projetos',
        hide_client: true,
      },
    ])
  }
}
