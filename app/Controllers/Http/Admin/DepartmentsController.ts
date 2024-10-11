import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { generate_filters_to_send, slug_parse, transform_pagination, where_slug_or_id } from 'App/Helpers'
import Department from 'App/Models/Department'
import DepartmentValidator from 'App/Validators/DepartmentValidator'

export default class DepartmentsController {

    async index(ctx: HttpContextContract) {
        try {
            let { response, auth } = ctx
            let departments: any = Department.query()
            if(auth.user && auth.user.id > 2){
              departments.whereNotIn('id', [1,2])
            }
            departments.preload('permissions')
            departments = await Department.listFiltersPaginate(ctx, departments)
            departments = transform_pagination(departments.toJSON())
            const filters = await generate_filters_to_send(Department)
            return response.status(200).send({...departments, filters})
        } catch (error) {
            throw error
        }
    }

    async store(ctx: HttpContextContract) {
        let trx = await Database.beginGlobalTransaction()
        try {
            const { request, response } = ctx
            const { name, permissions } = await request.validate(DepartmentValidator)
            const slug: string = await slug_parse(name)
            const department = await Department.create({name,slug})
            if(permissions && Array.isArray(permissions)){
                await department.related('permissions').sync(permissions, undefined, trx)
            }
            await trx.commit()
            return response.status(200).send({data: department})
        } catch (error) {
            await trx.rollback()
            throw error
        }
    }

    async show({ params : { id }, response }: HttpContextContract) {
        try {
            const department = await where_slug_or_id(Department, id)
            await department.load('permissions')
            return response.status(200).send({data: department})
        } catch (error) {
            throw error
        }
    }

    async update({ params : { id }, request, response }: HttpContextContract) {
        const trx = await Database.beginGlobalTransaction()
        try {
            const { name, permissions } = request.all()
            const slug: string = await slug_parse(name)
            const department = await where_slug_or_id(Department, id, trx)
            if(!department){
                return response.status(404).send({
                    message: 'Departamento não encontrado'
                })
            }
            department.merge({name, slug})
            await department.save()
            if(permissions && Array.isArray(permissions)){
                await department.related('permissions').sync(permissions, undefined, trx)
            }
            await trx.commit()
            return response.status(200).send({data: department})
        } catch (error) {
            await trx.rollback()
            throw error
        }
    }

    async destroy({ params : { id }, response }: HttpContextContract) {
        try {
            const department = await where_slug_or_id(Department, id)
            await department.softDelete()
            return response.status(200).send({})
        } catch (error) {
            throw error
        }

    }

}

