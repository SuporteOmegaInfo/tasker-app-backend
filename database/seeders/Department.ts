import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Department from 'App/Models/Department'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Department.create({
      name: 'Gestão do Sistema',
      slug: 'gestao-do-sistema'
    })

    await Department.create({
      name: 'Administração do Sistema',
      slug: 'administracao-do-sistema'
    })

    await Department.create({
      name: 'Gestão de Empresa',
      slug: 'gestao-de-empresa'
    })

    await Department.create({
      name: 'Usuários',
      slug: 'usuarios'
    })
  }
}
