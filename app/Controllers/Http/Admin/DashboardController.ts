import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { generate_filters_to_send, slug_parse, transform_pagination, where_slug_or_id } from 'App/Helpers'
import Project from 'App/Models/Project'

export default class DashboardController {

  async index(ctx: HttpContextContract) {
    try {

      let { response, auth } = ctx

      if(auth.user && auth.user.id){

        let user_id = auth.user.id

        let my_projects = await Project.query().where('user_id', user_id)
        let my_related_projects = await Project.query().whereNot('user_id', user_id).andWhereHas('members', builder => {
          builder.where('id', user_id)
        })

        return response.status(200).send({my_projects,my_related_projects})
      }

    } catch (error) {
        throw error
    }
  }

}
