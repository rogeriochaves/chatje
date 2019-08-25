module Chat.Types exposing (Message, Model, Msg(..), NewMessagePayload)

import Dict
import RemoteData exposing (..)


type alias Model =
    { messages : Dict.Dict String (WebData (List Message))
    , draft : String
    }


type alias Message =
    { timestamp : Int
    , authorId : String
    , message : String
    , stickerId : Maybe String
    , attachment : Maybe String
    }


type alias NewMessagePayload =
    { threadId : String
    , timestamp : Int
    , authorId : String
    , message : String
    }


type Msg
    = NoOp
    | LoadedMessages String (WebData (List Message))
    | UpdateDraft String
    | SendMessage String
    | NewMessage NewMessagePayload
