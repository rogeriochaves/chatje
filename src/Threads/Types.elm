module Threads.Types exposing (Model, Msg(..), Participant, Thread, Threads)

import RemoteData exposing (..)


type alias Model =
    { threads : WebData Threads
    , unreads : List String
    }


type alias Threads =
    List Thread


type alias Thread =
    { id : String
    , name : Maybe String
    , participants : List Participant
    }


type alias Participant =
    { id : String
    , name : String
    }


type Msg
    = NoOp
    | LoadedThreads (WebData Threads)
