import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { generate_filters_to_send, transform_pagination, where_slug_or_id } from 'App/Helpers'
import Project from 'App/Models/Project'
import EntityService from 'App/Services/EntityService'
import ProjectValidator from 'App/Validators/ProjectValidator'
import { format } from 'date-fns'

export default class ProjectsController {

    async index(ctx: HttpContextContract) {
        try {
            let { response, auth } = ctx
            if(!auth){
              throw new Error('Falha na autenticação da resquisição')
            }
            let projects: any = Project.query()
            if(auth && auth.user){
              projects.where('author', auth.user.id)
            }
            projects = await Project.listFiltersPaginate(ctx, projects)
            projects = transform_pagination(projects.toJSON())
            const filters = await generate_filters_to_send(Project)
            return response.status(200).send({...projects, filters})
        } catch (error) {
            throw error
        }
    }

    async store(ctx: HttpContextContract) {
        let trx = await Database.beginGlobalTransaction()
        const enServ: EntityService = new EntityService();
        try {
            const { request, response, auth } = ctx
            const { name, color, members, expires_at  } = await request.validate(ProjectValidator)

            let dateExpire = expires_at.toJSDate()

            const project = await Project.create({
              name: name,
              color: color,
              company_id: auth?.user?.company_id,
              user_id: auth?.user?.id,
              expires_at: format(dateExpire, 'yyyy-MM-dd HH:mm:ss')
            }, trx)
            await enServ.slugfy('Project', project, trx)
            if(Array.isArray(members)){
              let members_register: any[] = []
              members.map(member => {
                members_register.push({
                  user_id: member,
                  project_id: project.id
                })
               })
              await project.related('members').createMany(members_register, trx)
            }
            await trx.commit()
            return response.status(200).send({data: project})
        } catch (error) {
            await trx.rollback()
            throw error
        }
    }

    async show({ params : { id }, response }: HttpContextContract) {
        try {
            let project = await where_slug_or_id(Project, id)
            await project.load('members', builder => {
              builder.preload('user', builder => {
                builder.select(['id', 'name', 'slug'])
              })
            })
            await project.load('author', builder => {
              builder.select(['id', 'name', 'slug'])
            })
            await project.load('company')
            await project.load('steps', builder => {
              builder.preload('members', builder => {
                builder.preload('user', builder => {
                  builder.select(['id', 'name', 'slug'])
                })
              })
            })

            project = project.toJSON()

            const members = project.members.map((member) => {
              return {
                id: member.user.id,
                name: member.user.name,
                slug: member.user.slug,
              };
            });
            project.members = members;

            project.steps = project.steps.map(step => {
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

            return response.status(200).send({data: project})
        } catch (error) {
            throw error
        }
    }

    async update({ params : { id }, request, response, auth }: HttpContextContract) {
      const enServ: EntityService = new EntityService();
      const trx = await Database.beginGlobalTransaction()
        try {
            const { name, color, members, expires_at } = await request.validate(ProjectValidator)
            const project = await where_slug_or_id(Project, id, trx)
            if(!project){
                return response.status(404).send({
                    message: 'Projeto não encontrado'
                })
            }
            project.merge({name, color, company_id: auth?.user?.company_id, members, expires_at: expires_at.toJSDate()})
            await project.save()
            await enServ.slugfy('Project', project, trx)
            if(Array.isArray(members)){
              await project.related('members').query().delete(trx)
              await project.related('members').createMany(members.map(m => {
                return {
                  user_id: m,
                  project_id: project.id
                }
              }))
            }
            await trx.commit()
            return response.status(200).send({data: project})
        } catch (error) {
            throw error
        }
    }

    async destroy({ params : { id }, response }: HttpContextContract) {
        try {
            const project = await where_slug_or_id(Project, id)

            await project.softDelete()
            return response.status(200).send({})
        } catch (error) {
            throw error
        }

    }

}

