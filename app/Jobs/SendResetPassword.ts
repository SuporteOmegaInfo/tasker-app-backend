import Mail from '@ioc:Adonis/Addons/Mail'
import { JobContract } from '@ioc:Rocketseat/Bull'

export default class SendResetPassword implements JobContract {
  public key = 'SendResetPassword'

  public async handle(job) {
    const {data} = job; // the 'data' variable has user data

    await Mail.send((message) => {
      message
        .from('sistema@tasker.com')
        .to(data.user.email)
        .subject('Novo código de Verificação Tasker')
        .htmlView('emails/resetpassword', { password: data.newPass })
    })

    return data;
  }
}
