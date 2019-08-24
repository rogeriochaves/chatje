module Types exposing (Model, Msg(..))

import Router.Types
import Threads.Types
import User.Types


type alias Model =
    { router : Router.Types.Model, threads : Threads.Types.Model, user : User.Types.Model }


type Msg
    = MsgForRouter Router.Types.Msg
    | MsgForThreads Threads.Types.Msg
    | MsgForUser User.Types.Msg
