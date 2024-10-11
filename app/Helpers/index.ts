import crypto from 'crypto'

/**
 *  Gera uma string aleatória
 *
 *  @param {int} length - O tamanho da string que você quer gerar
 *  @return {string} -  uma string randômica do tamanho do length
 */

const str_random = async (length = 40) => {
    let string = ''
    let len = string.length

    if (len < length) {
      let size = length - len
      let bytes = await crypto.randomBytes(size)
      let buffer = Buffer.from(bytes)
      string += buffer
        .toString('base64')
        .replace(/[^a-zA-Z0-9]/g, '')
        .substr(0, size)
    }

    return string
}

/**
 *  Gera uma string aleatória
 *
 *  @param {int} length - O tamanho da string que você quer gerar
 *  @return {string} -  uma string randômica do tamanho do length
 */

const dash_to_underline = async (text: string) => {
  while(text.indexOf('-') >= 0){
    text = text.replace('-', '_')
  }

  return text
}
/**
 *  Gera um slug a partir de uma string
 *
 *  @param {string} string - string de entrada qualquer
 *  @return {string}
 */
const slug_parse = async (string) => {
    return string
      .toLowerCase()
      .replace(/[àÀáÁâÂãäÄÅåª]+/g, 'a') // Special Characters #1
      .replace(/[èÈéÉêÊëË]+/g, 'e') // Special Characters #2
      .replace(/[ìÌíÍîÎïÏ]+/g, 'i') // Special Characters #3
      .replace(/[òÒóÓôÔõÕöÖº]+/g, 'o') // Special Characters #4
      .replace(/[ùÙúÚûÛüÜ]+/g, 'u') // Special Characters #5
      .replace(/[ýÝÿŸ]+/g, 'y') // Special Characters #6
      .replace(/[ñÑ]+/g, 'n') // Special Characters #7
      .replace(/[çÇ]+/g, 'c') // Special Characters #8
      .replace(/[ß]+/g, 'ss') // Special Characters #9
      .replace(/[Ææ]+/g, 'ae') // Special Characters #10
      .replace(/[Øøœ]+/g, 'oe') // Special Characters #11
      .replace(/[%]+/g, 'pct') // Special Characters #12
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
}

/**
 * Método que percorre os filtros do Model
 * e monta a filtragem da consulta
 * @param filters
 * @param query
 * @param requestFilters
 * @returns
 */
const list_filters = (filters, query, requestFilters) => {
    const filterKeys: string[] = Object.keys(filters)

    filterKeys.map((key) => {
        const filter = filters[key]
        const value = requestFilters[key]

        if (value) {
          check_filters_data(filter, value, query)
        }
    })

    return query
}

/**
 * Checa os filtros de um Model carregado na ListFilters e
 * Organiza a query dinamicamente
 * @param filter
 * @param value
 * @param query
 */
const check_filters_data = (filter, value, query) => {
    //Entrar nas condições apenas se houver um parametro road definido e preenchido
    if (filter.scale && filter.scale.length > 0) {
      //Analisar o primeiro nível da Road

    //   for (let i = 0; i < filter.scale.length; i++) {
    //     let currentFilter = filter.scale[i]

    //     if(currentFilter){
    //         query = query.whereHas(currentFilter)
    //     }else{
    //         prepare_filters[filter.type](filter, query, value, builder)
    //     }
    //   }

      query.whereHas(filter.scale[0], (builder) => {
        //Preparar o escalonamento caso haja um próximo nível na Road
        if (filter.scale[1]) {
          //Analisar o segundo nível da Road
          builder.whereHas(filter.scale[1], (builder) => {
            //Preparar o escalonamento caso haja um próximo nível na Road
            if (filter.scale[2]) {
              //Analisar o terceiro nível da Road
              builder.whereHas(filter.scale[2], (builder) => {
                //Preparar o escalonamento caso haja um próximo nível na Road
                if (filter.scale[3]) {
                  //Analisar o quarto nível da Road
                  builder.whereHas(filter.scale[3], (builder) => {
                    //Nível 4 (maximo) de escalonamento
                    prepare_filters[filter.type](filter, query, value, builder)
                  })
                } else {
                  //Nível 3 de escalonamento
                  prepare_filters[filter.type](filter, query, value, builder)
                }
              })
            } else {
              //Nível 2 de escalonamento
              prepare_filters[filter.type](filter, query, value, builder)
            }
          })
        } else {
          //Nível 1 de escalonamento
          prepare_filters[filter.type](filter, query, value, builder)
        }
      })
    } else {
      //Consulta no model puro sem escalonamento
      prepare_filters[filter.type](filter, query, value)
    }
}

/**
 * Formata os dados de saida do Adonis para os padrões do projeto
 * @param data
 * @returns
 */
const transform_pagination = (data: any) => {

  let result = {}

  if(data.meta && data.data){
    result = {
      ...result,
      pagination: {
        page: data.meta.current_page,
        per_page: data.meta.per_page,
        last_page: data.meta.last_page,
        total: data.meta.total,
      },
      data: data.data
    }
  }

  return result
}

/**
 * Converte os erros para um formato padrão
 * @param error
 */
const where_slug_or_id = async (model: any, id, trx?: any) => {

  return trx ? !isNaN(id) ? await model.findOrFail(id, { client: trx }) : await model.findByOrFail('slug', id, { client: trx }) : !isNaN(id) ? await model.findOrFail(id) : await model.findByOrFail('slug', id)

}

const generate_filters_to_send = async(model:any) => {
  return await Promise.all(
    Object.keys(model.filters).map(async (f) => {
        let element = model.filters[f]
        if(element.type == 'dropdown'){
            let model = await import(`App/Models/${element.modelName}`)
            const options = await model.default.query()
            return element = {
                ...element,
                options: options.map(o => {
                    return{
                        id: o.id,
                        name: o.name,
                        slug: o.slug
                    }
                })
            }
        }else{
            return element
        }
    })
)
}

/**
 * Prepara os filtros de acordo com a organização vinda do método check_filters_road
 */
const prepare_filters = {
    string(filter, query, value, builder) {
      if (filter.isLike) {
        builder
          ? builder.where(filter.field, 'LIKE', `%${value}%`)
          : query.where(filter.field, 'LIKE', `%${value}%`)
      } else {
        builder
          ? builder.where(filter.field, value)
          : query.where(filter.field, value)
      }
    },

    dropdown(filter, query, value, builder) {
      if (filter.isLike) {
        builder
          ? builder.where(filter.field, 'LIKE', `%${value}%`)
          : query.where(filter.field, 'LIKE', `%${value}%`)
      } else {
        builder
          ? builder.where(filter.field, value)
          : query.where(filter.field, value)
      }
    },

    boolean(filter, query, value, builder) {
      builder
        ? builder.where(filter.field, value)
        : query.where(filter.field, value)
    },

    min(filter, query, value, builder) {
      builder
        ? builder.where(filter.field, '>=', value)
        : query.where(filter.field, '>=', value)
    },

    max(filter, query, value, builder) {
      builder
        ? builder.where(filter.field, '<=', value)
        : query.where(filter.field, '<=', value)
    },

    array_in_related(filter, query, value, builder) {
      if (builder) {
        builder.whereHas(filter.related, (builder) => {
          builder.whereIn(`${filter.related}.${filter.field}`, [value])
        })
      } else {
        query.whereHas(`${filter.related}`, (builder) => {
          builder.whereIn(`${filter.field}`, [value])
        })
      }
    },

    order(filter, query, value, builder) {
      let spl = value.split('-')

      let field = spl[0]
      let orientation = spl[1]

      builder
        ? builder.orderBy(field, orientation)
        : query.orderBy(field, orientation)
    },
}

export {
    str_random,
    slug_parse,
    check_filters_data,
    list_filters,
    transform_pagination,
    where_slug_or_id,
    generate_filters_to_send,
    dash_to_underline
}
