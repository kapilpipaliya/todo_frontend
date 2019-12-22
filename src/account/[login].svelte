<script>
  // try to find on global users
  // try to find database with cust_name.
  let isSubmitting
  let er = ''

  // function handleSubmit ({ detail: { values, setSubmitting, resetForm } }) {
  //     isSubmitting = true;
  //     er = "";

  //     const request = new messages.LoginRequest();
  //     request.setUsername(values.username);
  //     request.setPassword(values.password);

  //     accountService.login(request, {}, function(err, response){
  //         isSubmitting = false;
  //         //const response = new messages.LoginResponse();
  //         if(!err){
  //             switch (response.getStatus()) {
  //                 case messages.LoginResponse.ErrorStatus.OK:
  //                     const token = response.getToken();
  //                     document.cookie = `time=${token}; path=/`;
  //                     // Todo: save cookie on context (and indexdb).
  //                     goto('/admin/dashboard');
  //                     break;
  //                 case messages.LoginResponse.ErrorStatus.USER_OR_PASS_NOT_MATCH:
  //                 default:
  //                     er = response.getErrorMsg();
  //                     break;
  //             }
  //         } else {
  //             er = JSON.stringify(err);
  //         }
  //     })
  // }

  function handleReset() {
    console.log('form has been reset')
  }

  // const schema = yup.object().shape({
  //     username: yup .string().required(),
  //     password: yup.string().min(4),
  // });
</script>

Login
<!-- <div class="h-vh-100 d-flex flex-justify-center flex-align-center">
  <div class="login-box">
    <Form schema="{schema}" on:submit="{handleSubmit}" let:isSubmitting let:isValid><img class="place-right mt-4-minus mr-6-minus" alt="image" src="images/pandora/images/p-120x120.png"/>
      <h1 class="mb-0">Login</h1>
      <div class="text-muted mb-4">Sign in to start your session</div>
      <div class="form-group">
        <Input name="username" icon="mif-envelop" placeholder="User name"></Input><span class="invalid_feedback">Please enter a valid email address</span>
      </div>
      <div class="form-group">
        <Input name="password" type="password" icon="mif-key" placeholder="Password"></Input><span class="invalid_feedback">Please enter a password</span>
      </div>
      <div class="form-group d-flex flex-align-center flex-justify-between">
        <input type="checkbox" data-role="checkbox" data-caption="Remember Me"/>
        <button class="button primary">Sign In</button>
      </div>
      <ShowError er="{er}"></ShowError>
      <div class="form-group border-top bd-default pt-2"><a class="d-block" href="/account/recover;">I forgot my password</a><a class="d-block" href="/account/register">Register a new membership</a></div>
    </Form>
  </div>
</div> -->
