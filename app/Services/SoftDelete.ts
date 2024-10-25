import { ModelQueryBuilderContract, BaseModel, LucidRow } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
// Optional null check query
export const softDeleteQuery = (query: ModelQueryBuilderContract<typeof BaseModel>) => {
  query.whereNull('deleted_at')
}
export const softDelete = async (row: LucidRow, column: string = 'deleted_at') => {

  row.merge({
    [column]: DateTime.local()
  })
  
  await row.save();

}