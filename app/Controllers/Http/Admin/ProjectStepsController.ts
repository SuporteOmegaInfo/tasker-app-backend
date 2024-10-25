import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { generate_filters_to_send, transform_pagination, where_slug_or_id } from 'App/Helpers'
import ProjectStep from 'App/Models/ProjectStep'
import EntityService from 'App/Services/EntityService'
import ProjectStepValidatorStore from 'App/Validators/ProjectStepValidatorStore'
import ProjectStepValidatorUpdate from 'App/Validators/ProjectStepValidatorUpdate'

export default class ProjectStepsController {

    async index(ctx: HttpContextContract) {
        try {
            let { response, auth } = ctx
            //let authServ: AuthService = new AuthService()
            let steps: any = ProjectStep.query()
            steps.preload('project')
            steps.preload('author')
            steps = await ProjectStep.listFiltersPaginate(ctx, steps)
            steps = transform_pagination(steps.toJSON())
            const filters = await generate_filters_to_send(ProjectStep)
            return response.status(200).send({...steps, filters})
        } catch (error) {
            throw error
        }
    }

    async store(ctx: HttpContextContract) {
      const enServ: EntityService = new EntityService();

        let trx = await Database.beginGlobalTransaction()
        try {
            const { request, response, auth } = ctx
            const { name, project_id } = await request.validate(ProjectStepValidatorStore)
            const step = await ProjectStep.create({
              name,
              project_id,
              user_id: auth?.user?.id
            })
            await enServ.slugfy('ProjectStep', step, trx)

            await trx.commit()

            await step.load('author')
            await step.load('members', builder => {
              builder.preload('user', builder => {
                builder.select(['id', 'name', 'slug'])
              })
            })

            let result = step.toJSON()

            if(result.members && result.members.length > 0){
              const members = result.members.map((member) => {
                return {
                  id: member.user.id,
                  name: member.user.name,
                  slug: member.user.slug,
                };
              });
              result.members = members;

              result.steps = result.steps.map(step => {
                if(step.members.length > 0){
                  step.members = step.members.map(member => {
                    return {
                      id: member.user.id,
                      name: member.user.name,
                      slug: member.user.slug,
                    }
                  })

                  return step
                }else{
                  return step
                }
              })
            }

            return response.status(200).send({data: result})
        } catch (error) {
            await trx.rollback()
            throw error
        }
    }

    async show({ params : { id }, response }: HttpContextContract) {
        try {
            const step = await where_slug_or_id(ProjectStep, id)
            await step.load('project')
            await step.load('author')
            await step.load('members')
            return response.status(200).send({data: step})
        } catch (error) {
            throw error
        }
    }

    async update({ params : { id }, request, response }: HttpContextContract) {
      const enServ: EntityService = new EntityService();
      const trx = await Database.beginGlobalTransaction()
        try {
          const { name, project_id, expires_at, members } = await request.validate(ProjectStepValidatorUpdate)
            const step = await where_slug_or_id(ProjectStep, id, trx)
            if(!step){
                return response.status(404).send({
                    message: 'Unidade não encontrada'
                })
            }
            step.merge({name, expires_at: expires_at?.toJSDate(), project_id})
            await step.save(trx)
            await enServ.slugfy('ProjectStep', step, trx)
            if(Array.isArray(members)){
              await step.related('members').query().delete(trx)
              await step.related('members').createMany(members.map(m => {
                return {
                  user_id: m,
                  project_step_id: step.id
                }
              }))
            }
            await trx.commit()

            await step.load('author')
            await step.load('members', builder => {
              builder.preload('user', builder => {
                builder.select(['id', 'name', 'slug'])
              })
            })

            let result = step.toJSON()

            if(result.members && result.members.length > 0){
              const members = result.members.map((member) => {
                return {
                  id: member.user.id,
                  name: member.user.name,
                  slug: member.user.slug,
                };
              });
              result.members = members;
            }

            return response.status(200).send({data: result})
        } catch (error) {
            throw error
        }
    }

    async destroy({ params : { id }, response }: HttpContextContract) {
        try {
            const step = await where_slug_or_id(ProjectStep, id)
            await step.softDelete()
            return response.status(200).send({})
        } catch (error) {
            throw error
        }

    }

}

