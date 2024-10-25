import { afterFind, BaseModel, beforeSave, belongsTo, BelongsTo, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { beforeFind,  beforeFetch } from '@ioc:Adonis/Lucid/Orm'
import { softDelete, softDeleteQuery } from '../Services/SoftDelete'
import { DateTime } from 'luxon'
import Position from './Position'
import Department from './Department'
import Permission from './Permission'
import { list_filters } from 'App/Helpers'
import hash from '@ioc:Adonis/Core/Hash'
import Company from './Company'
export default class User extends BaseModel {

  static get hidden () {
    return ['password']
  }

  static get filters () {
    return {
      name: {
        field: 'name',
        placeholder: 'Nome',
        type: 'string',
        isLike: true,
      },
      cpf: {
        field: 'cpf',
        placeholder: 'CPF',
        type: 'string',
      },
      email: {
        field: 'email',
        placeholder: 'E-mail',
        type: 'string',
        isLike: true,
      },
      position_id: {
        field: 'position_id',
        placeholder: 'Perfil',
        type: 'dropdown',
        modelName: 'Position'
      },
      department_id: {
        field: 'department_id',
        placeholder: 'Departamento',
        type: 'dropdown',
        modelName: 'Department'
      },
      // company_id: {
      //   field: 'company_id',
      //   placeholder: 'Unidade',
      //   type: 'dropdown',
      //   modelName: 'company'
      // },
      order: {
        field: 'order',
        placeholder: 'Classificar',
        type: 'order',
        options: [
          {
            name: 'Mais recentes',
            field: 'id',
            orientation: 'desc'
          },
          {
            name: 'Mais antigos',
            field: 'id',
            orientation: 'asc'
          },
          {
            name: 'Nome A-Z',
            field: 'name',
            orientation: 'asc'
          },
          {
            name: 'Nome Z-A',
            field: 'name',
            orientation: 'desc'
          },
        ]
      },
    }
  }

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public cpf: string

  @column()
  public phone: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public rememberMeToken: string | null

  @column()
  public position_id: number

  @column()
  public department_id: number

  @column()
  public company_id: number

  @column()
  public is_new_user: boolean

  @belongsTo(() => Position, {
    localKey: 'id',
    foreignKey: 'position_id'
  })
  public position: BelongsTo<typeof Position>

  @belongsTo(() => Department, {
    localKey: 'id',
    foreignKey: 'department_id'
  })
  public department: BelongsTo<typeof Department>

  @belongsTo(() => Company, {
    localKey: 'id',
    foreignKey: 'company_id'
  })
  public company: BelongsTo<typeof Company>

  @manyToMany(() => Permission, {
    pivotTable: 'user_permission'
  })
  public permissions: ManyToMany<typeof Permission>

  @column.dateTime({ serializeAs: null})
  public deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeFind()
  public static softDeletesFind = softDeleteQuery;
  @beforeFetch()
  public static softDeletesFetch = softDeleteQuery;

  public async softDelete(column?: string) {
    await softDelete(this, column);
  }

  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }

  public static async listFilters(ctx: HttpContextContract, currentQuery: any){

    const { request } = ctx

    let query = list_filters(this.filters, currentQuery, request.all())

    return query
  }
  public static async listFiltersPaginate(ctx: HttpContextContract, currentQuery: any){

    const { request, pagination } = ctx

    let query = list_filters(this.filters, currentQuery, request.all())

    return await query.paginate(pagination.page, pagination.limit)
  }

}
