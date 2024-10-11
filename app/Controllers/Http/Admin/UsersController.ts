import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { generate_filters_to_send, slug_parse, transform_pagination, where_slug_or_id } from 'App/Helpers'
import User from 'App/Models/User'
import AuthService from 'App/Services/AuthService'
import EntityService from 'App/Services/EntityService'
import UserValidator from 'App/Validators/UserValidator'

export default class UsersController {

    async index(ctx: HttpContextContract) {
        try {
            let { response, auth } = ctx
            let users: any = User.query().preload('permissions').preload('department').preload('position').preload('company').whereNot('id', 1)
            if(auth.user){
              users.where('company_id', auth.user.company_id)
            }
            users = await User.listFiltersPaginate(ctx , users)
            users = transform_pagination(users.toJSON())
            users = users.data.map(user => {
              return {
                id: user.id,
                name: user.name,
                slug: user.slug,
                email: user.email,
                position_id: user.position_id,
                position: user.position,
                department_id: user.department_id,
                department: user.department,
                company_id: user.company_id,
                company: user.company,
                permissions: user.permissions,
              }
            })

            const filters = await generate_filters_to_send(User)

            return response.status(200).send({...{ data: users }, filters})
        } catch (error) {
            throw error
        }
    }

    async store( { request, response }: HttpContextContract) {

      const enServ: EntityService = new EntityService();
      const trx = await Database.beginGlobalTransaction()
      const authServ : AuthService = new AuthService()

      try {
          const { name, email, permissions, position_id, department_id, company_id } = await request.validate(UserValidator)

          const user = await User.create({
            name, email, position_id, department_id, company_id
          }, trx)

          await enServ.slugfy('User', user, trx)

          if(Array.isArray(permissions)){
              await user.related('permissions').sync(permissions, undefined, trx)
          }
          await user.load('permissions')
          await user.load('department')
          await user.load('position')
          await user.load('company')

          await trx.commit()
          await authServ.resetPassword(user)
          return response.status(200).send({data: user})
      } catch (error) {
          // if(trx){
          //   await trx.rollback()
          // }
          throw error
      }

    }

    async show({ params : { id }, response }: HttpContextContract) {
        try {
            let user = await where_slug_or_id(User, id)
            await user.load('permissions')
            await user.load('company')
            await user.load('department', dpquery => {
                dpquery.preload('permissions')
            })
            await user.load('position', (psquery) => {
              psquery.preload('permissions')
            })
            user.password = null
            return response.status(200).send({data: user})
        } catch (error) {
            throw error
        }

    }

    async update({ params : { id }, request, response }: HttpContextContract) {

        const trx = await Database.beginGlobalTransaction()

        try {
            const { name, permissions, position_id, department_id, company_id } = await request.validate(UserValidator)
            const user = await where_slug_or_id(User, id, trx)
            const slug: string = await slug_parse(name)
            user.merge({name, slug, department_id, position_id, company_id})
            await user.save(trx)
            if(Array.isArray(permissions)){
                await user.related('permissions').sync(permissions, undefined, trx)
            }

            await user.load('permissions', trx)
            await user.load('department', trx)
            await user.load('position', trx)
            await user.load('company', trx)

            await trx.commit()
            return response.status(200).send({data: user})
        } catch (error) {
            // if(trx){
            //   await trx.rollback()
            // }
            throw error
        }

    }

    async indexMembers(ctx: HttpContextContract) {
      try {
          let { response, auth } = ctx
          let users: any = User.query().whereNot('id', 1).preload('permissions').preload('department').preload('position').preload('company')
          if(auth.user){
            users.where('company_id', auth.user.company_id).whereNot('id', auth.user.id)
          }
          users = await User.listFiltersPaginate(ctx , users)
          users = transform_pagination(users.toJSON())
          users = users.data.map(user => {
            return  {
              id: user.id,
              name: user.name,
              slug: user.slug
            }
          })

          const filters = await generate_filters_to_send(User)

          return response.status(200).send({...{data: users}, filters})
      } catch (error) {
          throw error
      }
  }
}
