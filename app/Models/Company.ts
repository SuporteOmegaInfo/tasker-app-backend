import { BaseModel, BelongsTo, beforeFetch, beforeFind, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import Address from './Address'
import { list_filters } from 'App/Helpers'
import { softDeleteQuery, softDelete } from 'App/Services/SoftDelete'

export default class Company extends BaseModel {

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
  public address_id: number

  @belongsTo(() => Address, {
    localKey: 'id',
    foreignKey: 'address_id'
  })
  public address: BelongsTo<typeof Address>

  @column.dateTime()
  public deleted_at: DateTime

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
