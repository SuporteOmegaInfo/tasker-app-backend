import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Position from 'App/Models/Position'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Position.create({
      name: 'Manutenção',
      slug: 'manutencao'
    })
    await Position.create({
      name: 'Gestor do Sistema',
      slug: 'gestor-do-sistema'
    })
    await Position.create({
      name: 'Administrador do Sistema',
      slug: 'administrador-do-sistema'
    })
    await Position.create({
      name: 'Gestor da Empresa',
      slug: 'gestor-da-empresa'
    })
    await Position.create({
      name: 'Usuário',
      slug: 'usuario'
    })
  }
}
