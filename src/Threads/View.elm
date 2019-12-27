module Threads.View exposing (renderThread, view)

import Element exposing (..)
import Element.Input as Input
import Html.Attributes
import Html.Events
import Json.Decode as Decode
import RemoteData exposing (..)
import Router.Routes exposing (..)
import Styles
import Threads.Data exposing (isUnread, searchFilter, selectedThread, threadName)
import Threads.Types exposing (..)
import User.Types exposing (User)


view : Page -> WebData User -> Model -> Element Msg
view currentPage user model =
    let
        selected =
            selectedThread user model
    in
    column []
        [ el ([ width fill ] ++ Styles.searchBox)
            (Input.text
                ([ height (px 40)
                 , threadNavigation selected
                 ]
                    ++ Styles.messageBoxInput
                )
                { onChange = UpdateSearch
                , text = model.searchQuery
                , placeholder = Just (Input.placeholder [] (text "Search threads"))
                , label = Input.labelHidden "message to send"
                }
            )
        , column
            [ width (px 300)
            , clipY
            , scrollbarY
            , htmlAttribute (Html.Attributes.style "height" "calc(100vh - 45px)")
            ]
            [ renderThreadList currentPage user model selected ]
        ]


threadNavigation : ThreadSelection -> Element.Attribute Msg
threadNavigation selected =
    Element.htmlAttribute
        (Html.Events.on "keyup"
            (Decode.field "key" Decode.string
                |> Decode.andThen
                    (\key ->
                        if key == "Enter" then
                            Decode.succeed (SearchOrSelectThread selected)

                        else if key == "ArrowUp" then
                            Decode.succeed IndexUp

                        else if key == "ArrowDown" then
                            Decode.succeed IndexDown

                        else
                            Decode.fail "Not a navigation key"
                    )
            )
        )


renderThreadList : Page -> WebData User -> Model -> ThreadSelection -> Element Msg
renderThreadList currentPage pendingUser model selected =
    case ( model.searchResult, model.threads, pendingUser ) of
        ( Success users, _, _ ) ->
            column [ width fill ]
                (List.map (renderSearchResult selected) users)

        ( Loading, _, _ ) ->
            el [ padding 8 ] (text "Searching...")

        ( Failure _, _, _ ) ->
            el [ padding 8 ] (text "Error on searching users")

        ( _, Success threads, Success user ) ->
            column [ width fill ]
                (threads
                    |> List.filter (searchFilter user model)
                    |> List.map (renderThread currentPage user model selected)
                )

        ( _, Failure _, _ ) ->
            el [ padding 8 ] (text "Error on loading threads")

        ( _, _, Failure _ ) ->
            el [ padding 8 ] (text "Error on loading user")

        _ ->
            none


renderSearchResult : ThreadSelection -> Participant -> Element Msg
renderSearchResult selected user =
    let
        selectedStyle =
            if selected == SearchResult user.id then
                Styles.selectedThread

            else
                []
    in
    link ([ padding 8, width fill ] ++ Styles.readThread ++ selectedStyle)
        { url = "/chat/" ++ user.id
        , label = paragraph [] [ text user.name ]
        }


renderThread : Page -> User -> Model -> ThreadSelection -> Thread -> Element Msg
renderThread currentPage user model selected thread =
    let
        threadStyle =
            if isUnread model thread.id then
                Styles.unreadThread

            else
                Styles.readThread

        currentThreadStyle =
            case currentPage of
                ChatPage threadId ->
                    if threadId == thread.id then
                        Styles.currentThread

                    else
                        []

                _ ->
                    []

        selectedStyle =
            if selected == RecentThread thread.id then
                Styles.selectedThread

            else
                []
    in
    link ([ padding 8, width fill ] ++ threadStyle ++ currentThreadStyle ++ selectedStyle)
        { url = "/chat/" ++ thread.id
        , label = paragraph [] [ text (threadName user thread) ]
        }
