module Chat.Types exposing (Image, Message, Model, Msg(..))

import Dict
import RemoteData exposing (..)
import Time


type alias Model =
    { messages : Dict.Dict String (WebData (List Message))
    , draft : String
    , zone : Time.Zone
    , openInBrowserPopUp : Bool
    }


type alias Message =
    { threadId : String
    , timestamp : Int
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


type Msg
    = NoOp
    | LoadedMessages String (WebData (List Message))
    | UpdateDraft String
    | SendMessage String
    | NewMessage Message
    | ScrollChat
    | MessageSent Message
    | UpdateZone Time.Zone
    | CloseOpenInBrowserPopup
    | OpenInBrowser
