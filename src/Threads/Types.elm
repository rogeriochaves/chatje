module Threads.Types exposing (Model, Msg(..), Participant, Thread, Threads)

import RemoteData exposing (..)


type alias Model =
    { threads : WebData Threads
    }


type alias Threads =
    List Thread


type alias Thread =
    { id : String
    , name : Maybe String
    , participants : List Participant
    , unread : Bool
    }


type alias Participant =
    { id : String
    , name : String
    }


type Msg
    = NoOp
    | LoadedThreads (WebData Threads)
