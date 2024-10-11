import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { generate_filters_to_send, slug_parse, transform_pagination, where_slug_or_id } from 'App/Helpers'
import Address from 'App/Models/Address'
import Company from 'App/Models/Company'
//import AuthService from 'App/Services/AuthService'
import CompanyValidator from 'App/Validators/CompanyValidator'

export default class CompaniesController {

    async index(ctx: HttpContextContract) {
        try {
            let { response, auth } = ctx
            //let authServ: AuthService = new AuthService()
            let companies: any = Company.query()
            // let validateSuperUser = await authServ.validateUserPermissons(auth.user, ['criar-unidades'])
            if(auth.user && auth.user.department_id > 2){
              companies.where('id', auth.user.company_id)
            }
            companies.preload('address')
            companies = await Company.listFiltersPaginate(ctx, companies)
            companies = transform_pagination(companies.toJSON())
            const filters = await generate_filters_to_send(Company)
            return response.status(200).send({...companies, filters})
        } catch (error) {
            throw error
        }
    }

    async store(ctx: HttpContextContract) {
        let trx = await Database.beginGlobalTransaction()
        try {
            const { request, response } = ctx
            const { name, address } = await request.validate(CompanyValidator)
            const slug: string = await slug_parse(name)
            const company = await Company.create({name,slug})
            if(address && Object.keys(address).length > 0){
                const newAddress = await Address.create(address, trx)
                company.merge({address_id: newAddress.id})
                await company.save()
            }
            await trx.commit()
            return response.status(200).send({data: company})
        } catch (error) {
            await trx.rollback()
            throw error
        }
    }

    async show({ params : { id }, response }: HttpContextContract) {
        try {
            const company = await where_slug_or_id(Company, id)
            await company.load('address')
            return response.status(200).send({data: company})
        } catch (error) {
            throw error
        }
    }

    async update({ params : { id }, request, response }: HttpContextContract) {
        const trx = await Database.beginGlobalTransaction()
        try {
            const { name, address } = request.all()
            const slug: string = await slug_parse(name)
            const company = await where_slug_or_id(Company, id, trx)
            if(!company){
                return response.status(404).send({
                    message: 'Unidade não encontrada'
                })
            }
            company.merge({name, slug})
            if(address && Object.keys(address).length > 0){
                let companyAddress
                if(company.address_id){
                    companyAddress = await Address.find(company.address_id)
                    companyAddress.merge(address)
                    await companyAddress.save()
                }else{
                    companyAddress = await Address.create(address, trx)
                }
                company.merge({address_id: companyAddress.id})
                await company.save()
            }
            await company.save()
            await trx.commit()
            return response.status(200).send({data: company})
        } catch (error) {
            await trx.rollback()
            throw error
        }
    }

    async destroy({ params : { id }, response }: HttpContextContract) {
        try {
            const company = await where_slug_or_id(Company, id)
            if(company.address_id){
                let companyAddress = await Address.find(company.address_id)

                if(companyAddress){
                    await companyAddress.softDelete()
                }
            }
            await company.softDelete()
            return response.status(200).send({})
        } catch (error) {
            throw error
        }

    }

}

