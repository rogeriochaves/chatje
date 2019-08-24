module User.Types exposing (Model, Msg(..), User, Users)

import Dict
import RemoteData exposing (..)


type alias Model =
    { currentUser : WebData User
    , users : Users
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
