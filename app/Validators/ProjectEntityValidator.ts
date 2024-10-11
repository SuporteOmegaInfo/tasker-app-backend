import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProjectEntityValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    name: schema.string({}, [
      rules.required(),
      rules.minLength(3),
      rules.maxLength(100)
    ]),
    table_name: schema.string({}, [
      rules.required(),
      rules.minLength(3),
      rules.maxLength(100)
    ]),
    generate_pages: schema.boolean(),
    pages_filled: schema.string({}, [
      rules.minLength(1),
      rules.maxLength(1000)
    ]),
    hide_on_list: schema.string({}, [
      rules.minLength(1),
      rules.maxLength(100)
    ]),
    visibile: schema.boolean(),
    project_id: schema.number([
      rules.exists(['projects', 'id'])
    ]),
    fields: schema.array().members(schema.object().anyMembers())
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'name.required': 'Nome é obrigatório.',
    'name.minLength': 'Nome não pode conter menos de 3 caracteres.',
    'name.maxLength': 'Nome não pode conter mais de 100 caracteres.',
    'table_name.required': 'Nome da tabela é obrigatório.',
    'table_name.minLength': 'Nome da tabela não pode conter menos de 3 caracteres.',
    'table_name.maxLength': 'Nome da tabela não pode conter mais de 100 caracteres.',
    'generate_pages.boolean': 'Campo flag da geração de páginas inválido.',
    'pages_filled.minLength': 'Páginas publicadas não pode conter menos de 3 caracteres.',
    'pages_filled.maxLength': 'Páginas publicadas não pode conter mais de 1000 caracteres.',
    'hide_on_list.minLength': 'Não mostrar em listagens não pode conter menos de 3 caracteres.',
    'hide_on_list.maxLength': 'Não mostrar em listagens não pode conter mais de 100 caracteres.',
    'project_page_id.exists': 'Página informada não existe na base de dados.',
  }
}
