//LOGIN
function loginTest(){
    const loginForm = document.querySelector(".form");
    loginForm.addEventListener("submit", async function (event){
        event.preventDefault();

        const loginInfo = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value
        };
        const chargeUtile = JSON.stringify(loginInfo);

      fetch("http://localhost:5678/api/users/login",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile,
        }).then(response => response.json())
        .then(data => {
            if (data.userId && data.token){
                const userId = data.userId;
                const token = data.token;
                localStorage.setItem('token', token);
                window.location.href='index.html'
            }else{
                const message = data.message;
                if(message == "user not found"){
                alert("Email incorrecte");
                }else{
                    alert("Mot de passe incorrecte")
                }
            }
        });
    });
}
loginTest();