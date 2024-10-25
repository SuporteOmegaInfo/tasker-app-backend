import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'

import User from './User'
import ProjectStep from './ProjectStep'

export default class ProjectStepUser extends BaseModel {

  public static table = 'project_step_user'

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
  public project_step_id: number

  @belongsTo(() => ProjectStep, {
    localKey: 'id',
    foreignKey: 'project_step_id'
  })
  public project_step: BelongsTo<typeof ProjectStep>

}
