import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { slug_parse } from "App/Helpers";

class EntityService {
  public async slugfy(modelName: string, entity: any, trx: TransactionClientContract){
      let model: any = await import(`App/Models/${modelName}`)

      let slug = await slug_parse(entity.name || entity.title)

      let check = await model.default.query().where('slug', 'like', `%${slug}%`)

      if(check && check.length > 0){
        let slugList = check.map(({ slug }) => slug)
        const numbers: number[] = [];

        slugList.forEach(model => {
          const match = model.match(/(\d+)$/);
          if (match) {
              numbers.push(parseInt(match[1], 10));
          }
        });

        numbers.sort((a, b) => a - b);

        const missingNumbers: number[] = [];
        if (numbers.length > 0) {
            for (let i = numbers[0]; i <= numbers[numbers.length - 1]; i++) {
                if (!numbers.includes(i)) {
                    missingNumbers.push(i);
                }
            }
        }

        missingNumbers.sort((a, b) => a - b);

        if(missingNumbers.length > 0){
          slug = `${slug}${missingNumbers[0]}`
        }else if(numbers.length > 0){
          slug = `${slug}${(numbers[numbers.length-1])+1}`
        }

      }

      entity.merge({
        slug
      })

      await entity.save(trx);
  }
}
export default EntityService
