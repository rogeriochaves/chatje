module User.Types exposing (Model, Msg(..), User, Users)

import Dict
import RemoteData exposing (..)


type alias Model =
    { currentUser : WebData User
    , users : Users
    , email : String
    , pasteLink : String
    }


type alias Users =
    Dict.Dict String User


type alias User =
    { id : String
    , name : String
    }


type Msg
    = NoOp
    | LoadedUser (WebData User)
    | UpdateEmail String
    | Login
    | UpdatePasteLink String
    | PasteLinkSubmit
