module Threads.Types exposing (Model, Msg(..), Participant, Thread, Threads)

import RemoteData exposing (..)
import Set

type alias Model =
    { threads : WebData Threads
    , unreads : Set.Set String
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
    | RefreshThreads
