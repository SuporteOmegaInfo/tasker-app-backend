import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await User.create({
      name: 'Administrador',
      slug: 'administrador',
      password: '123456',
      email: 'admin@admin.com'
    })
    await User.create({
      name: 'Usuário Teste',
      slug: 'usuario-teste',
      password: '123456',
      email: 'usuario@usuario.com'
    })
    await User.create({
      name: 'Usuário Teste2',
      slug: 'usuario-teste2',
      password: '123456',
      email: 'usuario2@usuario.com'
    })
    await User.create({
      name: 'Usuário Teste3',
      slug: 'usuario-teste3',
      password: '123456',
      email: 'usuario3@usuario.com'
    }),
    await User.create({
      name: 'Gabriel Dias',
      slug: 'gabriel-dias',
      password: '123456',
      email: 'gabriel_eduardo_dias@hotmail.com'
    })
  }
}
