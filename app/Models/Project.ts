import { BaseModel, beforeFetch, beforeFind, belongsTo, BelongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { list_filters } from 'App/Helpers'
import { softDelete, softDeleteQuery } from 'App/Services/SoftDelete'
import { DateTime } from 'luxon'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Company from './Company'
import User from './User'
import ProjectUser from './ProjectUser'
import ProjectStep from './ProjectStep'

export default class Project extends BaseModel {

  static get filters () {
    return {
      name: {
        field: 'name',
        placeholder: 'Nome',
        type: 'string',
        isLike: true,
      },
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
  public color: string

  @column()
  public company_id: number

  @belongsTo(() => Company, {
    localKey: 'id',
    foreignKey: 'company_id'
  })
  public company: BelongsTo<typeof Company>

  @column()
  public user_id: number

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'user_id'
  })
  public author: BelongsTo<typeof User>

  @hasMany(() => ProjectUser, {
    localKey: 'id',
    foreignKey: 'project_id'
  })
  public members: HasMany<typeof ProjectUser>

  @hasMany(() => ProjectStep, {
    localKey: 'id',
    foreignKey: 'project_id'
  })
  public steps: HasMany<typeof ProjectStep>

  @column()
  public expires_at: DateTime | string

  @column()
  public deleted_at: DateTime | string

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
