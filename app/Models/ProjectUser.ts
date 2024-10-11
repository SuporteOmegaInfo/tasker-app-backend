import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'

import Project from './Project'
import User from './User'

export default class ProjectUser extends BaseModel {

  public static table = 'project_user'

  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'user_id'
  })
  public user: BelongsTo<typeof User>

  @column()
  public project_id: number

  @belongsTo(() => Project, {
    localKey: 'id',
    foreignKey: 'project_id'
  })
  public project: BelongsTo<typeof Project>

}
