import { createContext, ReactNode, useEffect, useState } from "react"; //  useEffect -- recuperar o estado de autenticação do usuário    
import { auth,firebase } from "../services/firebase";

 
//--------------------------------------------typescript----------------------------------------------------------------------
type User ={
  id: string;
  name: string;
  avatar: string;
}
type AuthContextType ={                                                           // quais informações no contexto
  user : User | undefined;
  signInWithGoogle: () => Promise<void>;                                          // retornando uma função sem retorno
}

type AuthContextProviderProps ={
  children: ReactNode;
}

//------------------------------------------------------------------------------------------------------------------------------
export const AuthContext = createContext({} as AuthContextType);


export function AuthContextProvider (props: AuthContextProviderProps){

  const [user, setUser] = useState<User>();                                      // Autenticação de usuário 
 
  useEffect(() => {                                                               //recuperar o estado de autenticação do usuário (fica ouvindo o usuário)
  const unsubscribe = auth.onAuthStateChanged(user =>{                            //onAuthStateChanged é um eventListener ele ficar ouvindo o evento
      if (user) {
        const {displayName, photoURL, uid} = user                                 //puxando alguns dados do usuário  (UID - identificador único de usuário)
        if (!displayName || !photoURL) {                                          // precisa ter nome e foto
          throw new Error(" Missing information from Google Account.");           // mensagem de erro 
        }
        setUser({                                                                 //se ele tem os dados, eu seto com as informação abaixo.         
        id: uid,
        name: displayName,
        avatar: photoURL
      })
      }
    })                                      
      return () => {
        unsubscribe(); 
      }

  }, [])

 async function signInWithGoogle(){                                             //autenticando com o Google
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider); 

    if (result.user) {                                                           // quando faz o login e da certo 
       const {displayName, photoURL, uid} = result.user                          //puxando alguns dados do usuário  (UID - identificador único de usuário)
       if (!displayName || !photoURL) {                                          // precisa ter nome e foto
         throw new Error(" Missing information from Google Account.");           // mensagem de erro 
       }
       setUser({                                                                 //se ele tem os dados, eu seto com as informação abaixo.         
       id: uid,
       name: displayName,
       avatar: photoURL
     })
   }
  }  
    //Compartilhando abaixo o user e signInWithGoogle para ter acesso ao usuário logado AuthContext.Provider value={{user , signInWithGoogle}}
    // mando o signInWithGoogle para todas as paginas que precisa fazer o login com o google
    return(
      <AuthContext.Provider value={{user , signInWithGoogle }}>  
      {props.children}
      </AuthContext.Provider>
    );
}