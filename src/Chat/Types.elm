module Chat.Types exposing (Image, Message, Model, Msg(..), NewMessagePayload)

import Dict
import RemoteData exposing (..)
import Time


type alias Model =
    { messages : Dict.Dict String (WebData (List Message))
    , draft : String
    , zone : Time.Zone
    }


type alias Message =
    { timestamp : Int
    , authorId : String
    , message : String
    , stickerId : Maybe String
    , image : Maybe Image
    }


type alias Image =
    { url : String
    , width : Int
    , height : Int
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
    | ScrollChat
    | MessageSent NewMessagePayload
    | UpdateZone Time.Zone
