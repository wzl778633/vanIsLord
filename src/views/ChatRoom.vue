<template>
  <div id="chatRoom">
    <chat-window
        height="100%"
        :current-user-id="currentUserId"
        :rooms-loaded="true"
        :messages-loaded="message_fullyLoad_flag"
        :rooms="rooms"
        :messages="messages"
        :text-messages="{
            ROOMS_EMPTY: 'No conversation',
            ROOM_EMPTY: 'No conversation selected 未选中任何对话',
            NEW_MESSAGES: 'New message 新消息',
            MESSAGE_DELETED: 'This message has been deleted 该消息已被删除',
            MESSAGES_EMPTY: 'No message 没有消息哦',
            CONVERSATION_STARTED: 'The conversation started on 对话从这里开始:',
            TYPE_MESSAGE: 'Type your message 输入你的消息，Van听着呢',
            SEARCH: 'search 搜索房间',
            IS_ONLINE: 'online 在线',
            LAST_SEEN: 'last connection 上次在线',
            IS_TYPING: 'is typing... 正在打字中',
            CANCEL_SELECT_MESSAGE: 'Cancel selection 点我取消消息选中'
        }"
        :responsive-breakpoint ="800"
        @open-file = "download"
        @send-message = "handleSend"
        @edit-message = "handleEdit"
        @delete-message="handleDelete"
        @add-room ="addRoom"
        @fetch-messages="getThisRoomMessage"
        :menu-actions="rightNowRoomId === 1 ? []: isPrivateRoom ?  [{name: 'inviteUser',title: '邀请其他用户'},{name: 'deleteRoom',title: '删除该房间'}] : [{name: 'inviteUser',title: '邀请其他用户'}, {name: 'removeUser',title: '退出该房间'}]"
        theme="dark"
    >
    </chat-window>
    <user-select-dialog :userSelectDialogShow = "userSelectDialogShow" @closeUserSelectWithUserList = "getUserList"></user-select-dialog>
  </div>

</template>

<script>
import UserSelectDialog from "@/components/UserSelectDialog";
export default {
  name: "ChatRoom",
  components: {UserSelectDialog},
  data() {
    return {
      scrollBarTimer:null,
      userSelectDialogShow:false,
      rightNowRoomId:1,
      isPrivateRoom:false,
      tmpUserListForCreate:[],
      message_fullyLoad_flag:false,

      rooms: [
        {
          roomId: 1,
          roomName: 'Room 1',
          avatar: 'assets/imgs/people.png',
          unreadCount: 4,
          index: 2,
          lastMessage: {
            content: 'Last message received',
            senderId: 1234,
            username: 'John Doe',
            timestamp: '10:20',
            saved: true,
            distributed: false,
            seen: false,
            new: true
          },
          users: [
            {
              _id: 1234,
              username: 'John Doe',
              avatar: 'assets/imgs/doe.png',
              status: {
                state: 'online',
                lastChanged: 'today, 14:30'
              }
            },
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
            {
              _id: 132,
              username: 'qwfq',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            }
          ],
          typingUsers: [ 4321 ]
        },
        {
          roomId: 2,
          roomName: 'Room 2',
          avatar: 'assets/imgs/people.png',
          unreadCount: 9,
          index: 1,
          lastMessage: {
            content: 'Last message received',
            senderId: 1234,
            username: 'John Doe',
            timestamp: '10:20',
            saved: true,
            distributed: false,
            seen: false,
            new: true
          },
          users: [
            {
              _id: 1234,
              username: 'John Doe',
              avatar: 'assets/imgs/doe.png',
              status: {
                state: 'online',
                lastChanged: 'today, 14:30'
              }
            },
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ],
          typingUsers: [ 1234 ]
        },
        {
          roomId: 3,
          roomName: 'Room 3',
          avatar: 'assets/imgs/people.png',
          unreadCount: 9,
          index: 0,
          lastMessage: {
            content: 'Last message received',
            senderId: 1234,
            username: 'John Doe',
            timestamp: '10:20',
            saved: true,
            distributed: false,
            seen: false,
            new: true
          },
          users: [
            {
              _id: 1234,
              username: 'John Doe',
              avatar: 'assets/imgs/doe.png',
              status: {
                state: 'online',
                lastChanged: 'today, 14:30'
              }
            },
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ],
          typingUsers: [ 4321 ]
        },
      ],
      messages:[
        {
          _id: 7890,
          indexId: 1,
          content: 'Message 1',
          senderId: 1234,
          username: 'John Doe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:20',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: true,
          disableActions: false,
          disableReactions: false,
          files: [
            {
              name: 'My File',
              size: 67351,
              type: 'png',
              audio: true,
              duration: 14.4,
              url: 'http://192.168.1.169:9090/vopen/2ad2c60edd9519fa644022f165f23695?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6InRlc3QiLCJleHAiOjE2NTM0ODIzNDl9.MGfncrMBJ4-YskbBOBop5QrVsihNw3jimkwr-YVm3Jk',
              preview: 'data:image/png;base64,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',

            },
            {
              name: 'My Replied File',
              size: 67351,
              type: 'png',
              audio: true,
              duration: 14.4,
              url: 'https://firebasestorage.googleapis.com/...',
              preview: 'data:image/png;base64,iVBORw0KGgoAA...'
            }
          ],
          reactions: {
      '😁': [
      1234, // USER_ID
      4321
    ],
      '🥰': [
      1234
    ]
  },
    replyMessage: {
      content: 'Reply Message',
          senderId: 4321,
          files: [
        {
          name: 'My Replied File',
          size: 67351,
          type: 'png',
          audio: true,
          duration: 14.4,
          url: 'https://firebasestorage.googleapis.com/...',
          preview: 'data:image/png;base64,iVBORw0KGgoAA...'
        }

      ]
    },
  },
        {
          _id: 78966,
          indexId: 99999,
          content: '<usertag>1234</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 1234,
              username: 'John Doe',
              avatar: 'assets/imgs/doe.png',
              status: {
                state: 'online',
                lastChanged: 'today, 14:30'
              }
            },
          ]
        },
        {
          _id: 78941,
          indexId: 2123,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: 789412,
          indexId: 124,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: 78931,
          indexId: 213123,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: 78912,
          indexId: 23441,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
        {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
  ],
      currentUserId: 4321,
    }
  },
  mounted() {

  },
  methods:{
    async download(params){
      let {msg, file} = params;
      const a = document.createElement('a');
      a.download = `${file.file.name}`;
      //a.href = `https://aijiangsb.com:9070/api/vdownload/${this.hash}?token=${localStorage.loginToken}`;
      let realUrl = file.file.url.replace('vopen','vdownload')
      a.href = realUrl;
      await a.click();
      a.remove();
    },
    handleSend({roomId, content, files, replyMessage, usersTag} = data){
      console.log("send")
      console.log(roomId)
      console.log(content)
      console.log(files)
      console.log(replyMessage)
      console.log(usersTag)

    },
    handleEdit({roomId, messageId, newContent, files, replyMessage, usersTag} = data){
      console.log("edit")
      console.log(roomId)
      console.log(messageId)
      console.log(newContent)
      console.log(files)
      console.log(replyMessage)
      console.log(usersTag)

    },
    handleDelete({roomId, message} = data){
      console.log("delete")
      console.log(roomId)
      console.log(message)

    },
    addRoom(){
      console.log("addRoom");
      this.userSelectDialogShow = true;

    },
    async getUserList(value){
      if(value){
        this.tmpUserListForCreate = value;
        console.log("success");
        this.userSelectDialogShow = false;
      }
      else{
        console.log("Nope no LIST");
        this.userSelectDialogShow = false;
      }
    },

    //important
    getThisRoomMessage({room, options} = data){

      this.message_fullyLoad_flag = false;
      console.log("getRoomMessage")
      console.log(room)
      console.log(options)
      console.log( this.message_fullyLoad_flag)
      this.rightNowRoomId = room.roomId;
      options.reset = false;

      if(room.users.length <=2){
        this.isPrivateRoom = true;
      }
      else{
        this.isPrivateRoom = false;
      }
      setTimeout(() => {
        let tmp = [ {
          _id: Math.random()*1000,
          indexId: Math.random()*1000,
          content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
          senderId: 4321,
          username: 'qwe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:22',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: false,
          disableActions: false,
          disableReactions: false,
          reactions: {
            '😁': [
              1234, // USER_ID
              4321
            ],
            '🥰': [
              1234
            ]
          },
          usersTag:[
            {
              _id: 4321,
              username: 'John Snow',
              avatar: 'assets/imgs/snow.png',
              status: {
                state: 'offline',
                lastChanged: '14 July, 20:00'
              }
            },
          ]
        },
          {
            _id: Math.random()*1000,
            indexId: Math.random()*1000,
            content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
            senderId: 4321,
            username: 'qwe',
            avatar: 'assets/imgs/doe.png',
            date: '13 November',
            timestamp: '10:22',
            system: false,
            saved: true,
            distributed: true,
            seen: true,
            deleted: false,
            failure: false,
            disableActions: false,
            disableReactions: false,
            reactions: {
              '😁': [
                1234, // USER_ID
                4321
              ],
              '🥰': [
                1234
              ]
            },
            usersTag:[
              {
                _id: 4321,
                username: 'John Snow',
                avatar: 'assets/imgs/snow.png',
                status: {
                  state: 'offline',
                  lastChanged: '14 July, 20:00'
                }
              },
            ]
          },
          {
            _id: Math.random()*1000,
            indexId: Math.random()*1000,
            content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
            senderId: 4321,
            username: 'qwe',
            avatar: 'assets/imgs/doe.png',
            date: '13 November',
            timestamp: '10:22',
            system: false,
            saved: true,
            distributed: true,
            seen: true,
            deleted: false,
            failure: false,
            disableActions: false,
            disableReactions: false,
            reactions: {
              '😁': [
                1234, // USER_ID
                4321
              ],
              '🥰': [
                1234
              ]
            },
            usersTag:[
              {
                _id: 4321,
                username: 'John Snow',
                avatar: 'assets/imgs/snow.png',
                status: {
                  state: 'offline',
                  lastChanged: '14 July, 20:00'
                }
              },
            ]
          }, {
            _id: Math.random()*1000,
            indexId: Math.random()*1000,
            content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
            senderId: 4321,
            username: 'qwe',
            avatar: 'assets/imgs/doe.png',
            date: '13 November',
            timestamp: '10:22',
            system: false,
            saved: true,
            distributed: true,
            seen: true,
            deleted: false,
            failure: false,
            disableActions: false,
            disableReactions: false,
            reactions: {
              '😁': [
                1234, // USER_ID
                4321
              ],
              '🥰': [
                1234
              ]
            },
            usersTag:[
              {
                _id: 4321,
                username: 'John Snow',
                avatar: 'assets/imgs/snow.png',
                status: {
                  state: 'offline',
                  lastChanged: '14 July, 20:00'
                }
              },
            ]
          },
          {
            _id: Math.random()*1000,
            indexId: Math.random()*1000,
            content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
            senderId: 4321,
            username: 'qwe',
            avatar: 'assets/imgs/doe.png',
            date: '13 November',
            timestamp: '10:22',
            system: false,
            saved: true,
            distributed: true,
            seen: true,
            deleted: false,
            failure: false,
            disableActions: false,
            disableReactions: false,
            reactions: {
              '😁': [
                1234, // USER_ID
                4321
              ],
              '🥰': [
                1234
              ]
            },
            usersTag:[
              {
                _id: 4321,
                username: 'John Snow',
                avatar: 'assets/imgs/snow.png',
                status: {
                  state: 'offline',
                  lastChanged: '14 July, 20:00'
                }
              },
            ]
          },
          {
            _id: Math.random()*1000,
            indexId: Math.random()*1000,
            content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
            senderId: 4321,
            username: 'qwe',
            avatar: 'assets/imgs/doe.png',
            date: '13 November',
            timestamp: '10:22',
            system: false,
            saved: true,
            distributed: true,
            seen: true,
            deleted: false,
            failure: false,
            disableActions: false,
            disableReactions: false,
            reactions: {
              '😁': [
                1234, // USER_ID
                4321
              ],
              '🥰': [
                1234
              ]
            },
            usersTag:[
              {
                _id: 4321,
                username: 'John Snow',
                avatar: 'assets/imgs/snow.png',
                status: {
                  state: 'offline',
                  lastChanged: '14 July, 20:00'
                }
              },
            ]
          },
          {
            _id: Math.random()*1000,
            indexId: Math.random()*1000,
            content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
            senderId: 4321,
            username: 'qwe',
            avatar: 'assets/imgs/doe.png',
            date: '13 November',
            timestamp: '10:22',
            system: false,
            saved: true,
            distributed: true,
            seen: true,
            deleted: false,
            failure: false,
            disableActions: false,
            disableReactions: false,
            reactions: {
              '😁': [
                1234, // USER_ID
                4321
              ],
              '🥰': [
                1234
              ]
            },
            usersTag:[
              {
                _id: 4321,
                username: 'John Snow',
                avatar: 'assets/imgs/snow.png',
                status: {
                  state: 'offline',
                  lastChanged: '14 July, 20:00'
                }
              },
            ]
          },
          {
            _id: Math.random()*1000,
            indexId: Math.random()*1000,
            content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
            senderId: 4321,
            username: 'qwe',
            avatar: 'assets/imgs/doe.png',
            date: '13 November',
            timestamp: '10:22',
            system: false,
            saved: true,
            distributed: true,
            seen: true,
            deleted: false,
            failure: false,
            disableActions: false,
            disableReactions: false,
            reactions: {
              '😁': [
                1234, // USER_ID
                4321
              ],
              '🥰': [
                1234
              ]
            },
            usersTag:[
              {
                _id: 4321,
                username: 'John Snow',
                avatar: 'assets/imgs/snow.png',
                status: {
                  state: 'offline',
                  lastChanged: '14 July, 20:00'
                }
              },
            ]
          },
          {
            _id: Math.random()*1000,
            indexId: Math.random()*1000,
            content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
            senderId: 4321,
            username: 'qwe',
            avatar: 'assets/imgs/doe.png',
            date: '13 November',
            timestamp: '10:22',
            system: false,
            saved: true,
            distributed: true,
            seen: true,
            deleted: false,
            failure: false,
            disableActions: false,
            disableReactions: false,
            reactions: {
              '😁': [
                1234, // USER_ID
                4321
              ],
              '🥰': [
                1234
              ]
            },
            usersTag:[
              {
                _id: 4321,
                username: 'John Snow',
                avatar: 'assets/imgs/snow.png',
                status: {
                  state: 'offline',
                  lastChanged: '14 July, 20:00'
                }
              },
            ]
          },
          {
            _id: Math.random()*1000,
            indexId: Math.random()*1000,
            content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
            senderId: 4321,
            username: 'qwe',
            avatar: 'assets/imgs/doe.png',
            date: '13 November',
            timestamp: '10:22',
            system: false,
            saved: true,
            distributed: true,
            seen: true,
            deleted: false,
            failure: false,
            disableActions: false,
            disableReactions: false,
            reactions: {
              '😁': [
                1234, // USER_ID
                4321
              ],
              '🥰': [
                1234
              ]
            },
            usersTag:[
              {
                _id: 4321,
                username: 'John Snow',
                avatar: 'assets/imgs/snow.png',
                status: {
                  state: 'offline',
                  lastChanged: '14 July, 20:00'
                }
              },
            ]
          },
          {
            _id: Math.random()*1000,
            indexId: Math.random()*1000,
            content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
            senderId: 4321,
            username: 'qwe',
            avatar: 'assets/imgs/doe.png',
            date: '13 November',
            timestamp: '10:22',
            system: false,
            saved: true,
            distributed: true,
            seen: true,
            deleted: false,
            failure: false,
            disableActions: false,
            disableReactions: false,
            reactions: {
              '😁': [
                1234, // USER_ID
                4321
              ],
              '🥰': [
                1234
              ]
            },
            usersTag:[
              {
                _id: 4321,
                username: 'John Snow',
                avatar: 'assets/imgs/snow.png',
                status: {
                  state: 'offline',
                  lastChanged: '14 July, 20:00'
                }
              },
            ]
          },
          {
            _id: Math.random()*1000,
            indexId: Math.random()*1000,
            content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
            senderId: 4321,
            username: 'qwe',
            avatar: 'assets/imgs/doe.png',
            date: '13 November',
            timestamp: '10:22',
            system: false,
            saved: true,
            distributed: true,
            seen: true,
            deleted: false,
            failure: false,
            disableActions: false,
            disableReactions: false,
            reactions: {
              '😁': [
                1234, // USER_ID
                4321
              ],
              '🥰': [
                1234
              ]
            },
            usersTag:[
              {
                _id: 4321,
                username: 'John Snow',
                avatar: 'assets/imgs/snow.png',
                status: {
                  state: 'offline',
                  lastChanged: '14 July, 20:00'
                }
              },
            ]
          },
          {
            _id: Math.random()*1000,
            indexId: Math.random()*1000,
            content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
            senderId: 4321,
            username: 'qwe',
            avatar: 'assets/imgs/doe.png',
            date: '13 November',
            timestamp: '10:22',
            system: false,
            saved: true,
            distributed: true,
            seen: true,
            deleted: false,
            failure: false,
            disableActions: false,
            disableReactions: false,
            reactions: {
              '😁': [
                1234, // USER_ID
                4321
              ],
              '🥰': [
                1234
              ]
            },
            usersTag:[
              {
                _id: 4321,
                username: 'John Snow',
                avatar: 'assets/imgs/snow.png',
                status: {
                  state: 'offline',
                  lastChanged: '14 July, 20:00'
                }
              },
            ]
          },
          {
            _id: Math.random()*1000,
            indexId: Math.random()*1000,
            content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
            senderId: 4321,
            username: 'qwe',
            avatar: 'assets/imgs/doe.png',
            date: '13 November',
            timestamp: '10:22',
            system: false,
            saved: true,
            distributed: true,
            seen: true,
            deleted: false,
            failure: false,
            disableActions: false,
            disableReactions: false,
            reactions: {
              '😁': [
                1234, // USER_ID
                4321
              ],
              '🥰': [
                1234
              ]
            },
            usersTag:[
              {
                _id: 4321,
                username: 'John Snow',
                avatar: 'assets/imgs/snow.png',
                status: {
                  state: 'offline',
                  lastChanged: '14 July, 20:00'
                }
              },
            ]
          },
          {
            _id: Math.random()*1000,
            indexId: Math.random()*1000,
            content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
            senderId: 4321,
            username: 'qwe',
            avatar: 'assets/imgs/doe.png',
            date: '13 November',
            timestamp: '10:22',
            system: false,
            saved: true,
            distributed: true,
            seen: true,
            deleted: false,
            failure: false,
            disableActions: false,
            disableReactions: false,
            reactions: {
              '😁': [
                1234, // USER_ID
                4321
              ],
              '🥰': [
                1234
              ]
            },
            usersTag:[
              {
                _id: 4321,
                username: 'John Snow',
                avatar: 'assets/imgs/snow.png',
                status: {
                  state: 'offline',
                  lastChanged: '14 July, 20:00'
                }
              },
            ]
          },
          {
            _id: Math.random()*1000,
            indexId: Math.random()*1000,
            content: '<usertag>4321</usertag> 棒鸡的🐴 遭遇不幸 ',
            senderId: 4321,
            username: 'qwe',
            avatar: 'assets/imgs/doe.png',
            date: '13 November',
            timestamp: '10:22',
            system: false,
            saved: true,
            distributed: true,
            seen: true,
            deleted: false,
            failure: false,
            disableActions: false,
            disableReactions: false,
            reactions: {
              '😁': [
                1234, // USER_ID
                4321
              ],
              '🥰': [
                1234
              ]
            },
            usersTag:[
              {
                _id: 4321,
                username: 'John Snow',
                avatar: 'assets/imgs/snow.png',
                status: {
                  state: 'offline',
                  lastChanged: '14 July, 20:00'
                }
              },
            ]
          },];
        tmp = tmp.concat(this.messages);
        this.messages = tmp;
        this.message_fullyLoad_flag = false;
      },300)
    },
  },


}
</script>

<style scoped>
#chatRoom{
  width: 100%;
  height:calc(100vh - 110px);
}

/deep/ .vac-container-scroll::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

/deep/ .vac-container-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(164, 159, 159, 0.7);
  border-radius: 100vw;
  border: 2px #2D2C2CFF solid;
  display: none;
}
/deep/ .vac-container-scroll:hover::-webkit-scrollbar-thumb {
  display: unset;
}
/deep/ .vac-container-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #a49f9f;
  border-radius: 100vw;
  border: 2px #2D2C2CFF solid;
}
/deep/ .vac-container-scroll::-webkit-scrollbar-track {
  background-color: #2D2C2CFF;
  border-radius: 100vw;
  margin-block: .5em;
  transition: all 0.3s ease-in-out;
  display: none;
}
/deep/ .vac-container-scroll:hover::-webkit-scrollbar-track{
  display: unset;
}


/deep/ .vac-room-list::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

/deep/ .vac-room-list::-webkit-scrollbar-thumb {
  background-color: rgba(164, 159, 159, 0.7);
  border-radius: 100vw;
  border: 2px #2D2C2CFF solid;
  display: none;
}
/deep/ .vac-room-list:hover::-webkit-scrollbar-thumb {
  display: unset;
}
/deep/ .vac-room-list::-webkit-scrollbar-thumb:hover {
  background-color: #a49f9f;
  border-radius: 100vw;
  border: 2px #2D2C2CFF solid;

}
/deep/ .vac-room-list::-webkit-scrollbar-track {
  background-color: #2D2C2CFF;
  border-radius: 100vw;
  margin-block: .5em;
  display: none;
}
/deep/ .vac-room-list:hover::-webkit-scrollbar-track{
  display: unset;
}
</style>