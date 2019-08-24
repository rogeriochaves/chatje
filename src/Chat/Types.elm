module Chat.Types exposing (Message, Model, Msg(..))

import Dict
import RemoteData exposing (..)


type alias Model =
    { messages : Dict.Dict String (WebData (List Message))
    }


type alias Message =
    { id : String
    , timestamp : Int
    , authorId : String
    , message : String
    }


type Msg
    = NoOp
    | LoadedMessages String (WebData (List Message))
