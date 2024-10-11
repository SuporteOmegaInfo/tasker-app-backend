import Mail from '@ioc:Adonis/Addons/Mail'
import { JobContract } from '@ioc:Rocketseat/Bull'

export default class SendMailToken implements JobContract {
  public key = 'SendMailToken'

  public async handle(job) {
    const { data } = job; // the 'data' variable has user data

    await Mail.send((message) => {
      message
        .from('sistema@tasker.com')
        .to(data.email)
        .subject('Novo código de Verificação Tasker')
        .htmlView('emails/mailtoken', { code: data.code })
    })

    return data;
  }
}
