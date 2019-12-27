module Threads.Types exposing (Model, Msg(..), Participant, Thread, ThreadSelection(..), Threads)

import RemoteData exposing (..)
import Set


type alias Model =
    { threads : WebData Threads
    , unreads : Set.Set String
    , searchQuery : String
    , searchResult : WebData (List Participant)
    , selectedIndex : Maybe Int
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
    | UpdateSearch String
    | SearchOrSelectThread ThreadSelection
    | LoadedSearch (WebData (List Participant))
    | IndexDown
    | IndexUp


type ThreadSelection
    = SearchResult String
    | RecentThread String
    | NothingSelected
