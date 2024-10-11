import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Company from 'App/Models/Company'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Company.create({
      name: 'Empresa 1',
      slug: 'empresa-1'
    })
  }
}
