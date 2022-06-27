<template>
  <div id="musicPlayer" :class = "show ? 'musicPlayer' :'musicPlayer hide'">
  <div class="wrapper">
    <transition name="cover">
    <div v-if= "show" class="player">
      <div class="player__top">
        <div class="player-cover">
        </div>
        <div class="player-controls">
          <div v-if="currentTrack.user_id === USER_ID" class="player-controls__item -favorite" :class="{ active : currentTrack.favorited }" @click="changeFavorite">
            <svg class="icon">
              <use :xlink:href="require('/node_modules/bootstrap-icons/bootstrap-icons.svg')+'#' + 'star-fill'"></use>
            </svg>
          </div>
          <div v-else class="player-controls__item -favorite" :class="{ active : currentTrack.favorited }">
            <svg class="icon">
              <use :xlink:href="require('/node_modules/bootstrap-icons/bootstrap-icons.svg')+'#' + 'slash-circle-fill'"></use>
            </svg>
          </div>
          <div v-if="currentTrack.user_id === USER_ID" class="player-controls__item -shared" :class="{ active : currentTrack.shared }" @click="changeShared">
            <svg class="icon">
              <use :xlink:href="require('/node_modules/bootstrap-icons/bootstrap-icons.svg')+'#' + 'share-fill'"></use>
            </svg>
          </div>
          <div v-else class="player-controls__item -shared" :class="{ active : currentTrack.shared }">
            <svg class="icon">
              <use :xlink:href="require('/node_modules/bootstrap-icons/bootstrap-icons.svg')+'#' + 'slash-circle-fill'"></use>
            </svg>
          </div>
          <div class="player-controls__item" @click="prevTrack">
            <svg class="icon">
              <use xlink:href="#icon-prev"></use>
            </svg>
          </div>
          <div class="player-controls__item" @click="nextTrack">
            <svg class="icon">
              <use xlink:href="#icon-next"></use>
            </svg>
          </div>

          <el-popover
              placement="left"
              width="20"
              popper-class = "volumePop"
              trigger="hover">
            <el-slider
                v-model="volumeValue"
                vertical
                height="100px"
                @input = "changeVolume"
                style = "margin: 5px 0">
            </el-slider>
          <div slot="reference" class="player-controls__item" @click="changeMute">
            <svg class="icon">
              <use :xlink:href="require('/node_modules/bootstrap-icons/bootstrap-icons.svg')+'#' + this.volumeState"></use>
            </svg>
          </div>
          </el-popover>
          <div class="player-controls__item -xl js-play" @click="play">
            <svg class="icon">
              <use xlink:href="#icon-pause" v-if="isTimerPlaying"></use>
              <use xlink:href="#icon-play" v-else></use>
            </svg>
          </div>

        </div>

      </div>

      <el-popover
          placement="left"
          popper-class = "listPop"
          trigger="hover"
          v-model="listClick">
        <div class="container">
          <el-table
              :show-header = "false"
              class="tmpTable"
              height="400"
              :row-style="{background:'transparent',color:'white'}"
              empty-text = "播放列表里暂无音乐"
              :data="tracks.filter(data => data.node_id !== -1)">
            <el-table-column
                width="300"
                property="file_name"
                label="歌名">
            </el-table-column>
            <el-table-column
                width="150"
                align="right">
              <template v-slot:default="scope">
                <i class ="listIcon bi-x-circle" @click = "removeSong(scope.$index)"> </i>
                <i v-if="isRandom? scope.$index === currentRandomTrackIndex : scope.$index === currentTrackIndex" class ="listIcon bi-music-note" style="color: #6eae43">正在播放</i>
                <i v-else class ="listIcon bi-play-circle" @click = "changeSongWithPlay(scope.$index)"> </i>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="reference" class="player-controls__item list" @click = "listClick = !listClick">
          <svg class="icon">
            <use :xlink:href="require('/node_modules/bootstrap-icons/bootstrap-icons.svg')+'#' + 'music-note-list'"></use>
          </svg>
        </div>
      </el-popover>
      <div class="player-controls__item shuffle" :class="{ active : isRandom }" @click="randomModeOn">
        <svg class="icon">
          <use :xlink:href="require('/node_modules/bootstrap-icons/bootstrap-icons.svg')+'#' + 'shuffle'"></use>
        </svg>
      </div>
      <div class="player-controls__item single" :class="{ active : isSingle }" @click="singleModeOn">
        <svg class="icon">
          <use :xlink:href="require('/node_modules/bootstrap-icons/bootstrap-icons.svg')+'#' + 'arrow-counterclockwise'"></use>
        </svg>
      </div>

      <div class="progress" ref="progress">
        <div class="progress__top">
          <div class="album-info" v-if="currentTrack">
            <div class="album-info__name">{{ currentTrack.name }}</div>
            <div class="album-info__track">{{ currentTrack.artist }}</div>
          </div>
          <div class="progress__duration">{{ duration }}</div>
        </div>
        <div class="progress__bar" @click="clickProgress">
          <div class="progress__current" :style="{ width : barWidth }"></div>
        </div>
        <div class="progress__time">{{ currentTime }}</div>
      </div>
      <div v-cloak></div>
    </div>
    </transition>
    <div :class="show ? 'player-cover  small': 'player-cover hide'" @click = "switchShow">
      <transition-group :name="transitionName">
        <div class="player-cover__item" v-if="isRandom? $index === currentRandomTrackIndex : $index === currentTrackIndex" :style="{ backgroundImage: `url(${track.cover})` }"  v-for="(track, $index) in tracks" :key="$index"></div>
      </transition-group>
    </div>

  </div>

  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: none">
    <defs>
      <symbol id="icon-heart-o" viewBox="0 0 32 32">
        <title>icon-heart-o</title>
        <path d="M22.88 1.952c-2.72 0-5.184 1.28-6.88 3.456-1.696-2.176-4.16-3.456-6.88-3.456-4.48 0-9.024 3.648-9.024 10.592 0 7.232 7.776 12.704 15.072 17.248 0.256 0.16 0.544 0.256 0.832 0.256s0.576-0.096 0.832-0.256c7.296-4.544 15.072-10.016 15.072-17.248 0-6.944-4.544-10.592-9.024-10.592zM16 26.56c-4.864-3.072-12.736-8.288-12.736-14.016 0-5.088 3.040-7.424 5.824-7.424 2.368 0 4.384 1.504 5.408 4.032 0.256 0.608 0.832 0.992 1.472 0.992s1.248-0.384 1.472-0.992c1.024-2.528 3.040-4.032 5.408-4.032 2.816 0 5.824 2.304 5.824 7.424 0.064 5.728-7.808 10.976-12.672 14.016z"></path>
        <path d="M16 30.144c-0.32 0-0.64-0.096-0.896-0.256-7.296-4.576-15.104-10.048-15.104-17.344 0-7.008 4.576-10.688 9.12-10.688 2.656 0 5.152 1.216 6.88 3.392 1.728-2.144 4.224-3.392 6.88-3.392 4.544 0 9.12 3.68 9.12 10.688 0 7.296-7.808 12.768-15.104 17.344-0.256 0.16-0.576 0.256-0.896 0.256zM9.12 2.048c-4.448 0-8.928 3.616-8.928 10.496 0 7.168 7.744 12.64 15.008 17.152 0.48 0.288 1.12 0.288 1.568 0 7.264-4.544 15.008-9.984 15.008-17.152 0-6.88-4.48-10.496-8.928-10.496-2.656 0-5.088 1.216-6.816 3.392l-0.032 0.128-0.064-0.096c-1.696-2.176-4.192-3.424-6.816-3.424zM16 26.688l-0.064-0.032c-3.808-2.4-12.768-8.032-12.768-14.112 0-5.152 3.072-7.52 5.952-7.52 2.432 0 4.48 1.536 5.504 4.096 0.224 0.576 0.768 0.928 1.376 0.928s1.152-0.384 1.376-0.928c1.024-2.56 3.072-4.096 5.504-4.096 2.848 0 5.952 2.336 5.952 7.52 0 6.080-8.96 11.712-12.768 14.112l-0.064 0.032zM9.12 5.248c-2.752 0-5.728 2.304-5.728 7.328 0 5.952 8.8 11.488 12.608 13.92 3.808-2.4 12.608-7.968 12.608-13.92 0-5.024-2.976-7.328-5.728-7.328-2.336 0-4.32 1.472-5.312 3.968-0.256 0.64-0.864 1.056-1.568 1.056s-1.312-0.416-1.568-1.056c-0.992-2.496-2.976-3.968-5.312-3.968z"></path>
        <path d="M6.816 20.704c0.384 0.288 0.512 0.704 0.48 1.12 0.224 0.256 0.384 0.608 0.384 0.96 0 0.032 0 0.032 0 0.064 0.16 0.128 0.32 0.256 0.48 0.384 0.128 0.064 0.256 0.16 0.384 0.256 0.096 0.064 0.192 0.16 0.256 0.224 0.8 0.576 1.632 1.12 2.496 1.664 0.416 0.128 0.8 0.256 1.056 0.32 1.984 0.576 4.064 0.8 6.112 0.928 2.688-1.92 5.312-3.904 8-5.792 0.896-1.088 1.92-2.080 2.912-3.104v-7.552c-0.096-0.128-0.192-0.288-0.32-0.416-0.768-1.024-1.184-2.176-1.6-3.296-0.768-0.416-1.536-0.8-2.336-1.12-0.128-0.064-0.256-0.096-0.384-0.16h-21.568v12.992c1.312 0.672 2.496 1.6 3.648 2.528z"></path>
      </symbol>
      <symbol id="icon-heart" viewBox="0 0 32 32">
        <title>icon-heart</title>
        <path d="M22.88 1.952c-2.72 0-5.184 1.28-6.88 3.456-1.696-2.176-4.16-3.456-6.88-3.456-4.48 0-9.024 3.648-9.024 10.592 0 7.232 7.776 12.704 15.072 17.248 0.256 0.16 0.544 0.256 0.832 0.256s0.576-0.096 0.832-0.256c7.296-4.544 15.072-10.016 15.072-17.248 0-6.944-4.544-10.592-9.024-10.592zM16 26.56c-4.864-3.072-12.736-8.288-12.736-14.016 0-5.088 3.040-7.424 5.824-7.424 2.368 0 4.384 1.504 5.408 4.032 0.256 0.608 0.832 0.992 1.472 0.992s1.248-0.384 1.472-0.992c1.024-2.528 3.040-4.032 5.408-4.032 2.816 0 5.824 2.304 5.824 7.424 0.064 5.728-7.808 10.976-12.672 14.016z"></path>
        <path d="M16 30.144c-0.32 0-0.64-0.096-0.896-0.256-7.296-4.576-15.104-10.048-15.104-17.344 0-7.008 4.576-10.688 9.12-10.688 2.656 0 5.152 1.216 6.88 3.392 1.728-2.144 4.224-3.392 6.88-3.392 4.544 0 9.12 3.68 9.12 10.688 0 7.296-7.808 12.768-15.104 17.344-0.256 0.16-0.576 0.256-0.896 0.256zM9.12 2.048c-4.448 0-8.928 3.616-8.928 10.496 0 7.168 7.744 12.64 15.008 17.152 0.48 0.288 1.12 0.288 1.568 0 7.264-4.544 15.008-9.984 15.008-17.152 0-6.88-4.48-10.496-8.928-10.496-2.656 0-5.088 1.216-6.816 3.392l-0.032 0.128-0.064-0.096c-1.696-2.176-4.192-3.424-6.816-3.424zM16 26.688l-0.064-0.032c-3.808-2.4-12.768-8.032-12.768-14.112 0-5.152 3.072-7.52 5.952-7.52 2.432 0 4.48 1.536 5.504 4.096 0.224 0.576 0.768 0.928 1.376 0.928s1.152-0.384 1.376-0.928c1.024-2.56 3.072-4.096 5.504-4.096 2.848 0 5.952 2.336 5.952 7.52 0 6.080-8.96 11.712-12.768 14.112l-0.064 0.032zM9.12 5.248c-2.752 0-5.728 2.304-5.728 7.328 0 5.952 8.8 11.488 12.608 13.92 3.808-2.4 12.608-7.968 12.608-13.92 0-5.024-2.976-7.328-5.728-7.328-2.336 0-4.32 1.472-5.312 3.968-0.256 0.64-0.864 1.056-1.568 1.056s-1.312-0.416-1.568-1.056c-0.992-2.496-2.976-3.968-5.312-3.968z"></path>
      </symbol>
      <symbol id="icon-infinity" viewBox="0 0 32 32">
        <title>icon-infinity</title>
        <path d="M29.312 20.832c-1.28 1.28-3.008 1.984-4.832 1.984s-3.52-0.704-4.832-1.984c-0.032-0.032-0.224-0.224-0.256-0.256v0 1.28c0 0.448-0.352 0.8-0.8 0.8s-0.8-0.352-0.8-0.8v-3.168c0-0.448 0.352-0.8 0.8-0.8h3.168c0.448 0 0.8 0.352 0.8 0.8s-0.352 0.8-0.8 0.8h-1.28c0.032 0.032 0.224 0.224 0.256 0.256 0.992 0.992 2.304 1.536 3.68 1.536 1.408 0 2.72-0.544 3.68-1.536 0.992-0.992 1.536-2.304 1.536-3.68s-0.544-2.72-1.536-3.68c-0.992-0.992-2.304-1.536-3.68-1.536-1.408 0-2.72 0.544-3.68 1.536l-8.416 8.448c-1.312 1.312-3.072 1.984-4.832 1.984s-3.488-0.672-4.832-1.984c-2.656-2.656-2.656-6.976 0-9.632s6.976-2.656 9.632 0c0.032 0.032 0.16 0.16 0.192 0.192l0.064 0.064v-1.28c0-0.448 0.352-0.8 0.8-0.8s0.8 0.352 0.8 0.8v3.168c0 0.448-0.352 0.8-0.8 0.8h-3.168c-0.448 0-0.8-0.352-0.8-0.8s0.352-0.8 0.8-0.8h1.28l-0.096-0.064c-0.032-0.032-0.16-0.16-0.192-0.192-0.992-0.992-2.304-1.536-3.68-1.536s-2.72 0.544-3.68 1.536c-2.048 2.048-2.048 5.344 0 7.392 0.992 0.992 2.304 1.536 3.68 1.536s2.72-0.544 3.68-1.536l8.512-8.512c1.28-1.28 3.008-1.984 4.832-1.984s3.52 0.704 4.832 1.984c2.624 2.656 2.624 7.008-0.032 9.664z"></path>
        <path d="M24.512 23.488c-1.6 0-3.136-0.512-4.416-1.44-0.128 0.704-0.736 1.248-1.44 1.248-0.8 0-1.472-0.672-1.472-1.472v-3.168c0-0.8 0.672-1.472 1.472-1.472h3.168c0.8 0 1.472 0.672 1.472 1.472 0 0.608-0.384 1.152-0.928 1.376 0.64 0.352 1.376 0.544 2.144 0.544 1.216 0 2.368-0.48 3.2-1.344 0.864-0.864 1.344-1.984 1.344-3.2s-0.48-2.368-1.344-3.2c-0.864-0.864-1.984-1.344-3.2-1.344s-2.368 0.48-3.2 1.344l-8.512 8.48c-1.408 1.408-3.296 2.176-5.312 2.176s-3.872-0.768-5.312-2.176c-2.912-2.912-2.912-7.68 0-10.592 1.408-1.408 3.296-2.176 5.312-2.176 0 0 0 0 0 0 1.6 0 3.136 0.512 4.416 1.44 0.128-0.704 0.736-1.248 1.472-1.248 0.8 0 1.472 0.672 1.472 1.472v3.168c0 0.8-0.672 1.472-1.472 1.472h-3.168c-0.8 0-1.472-0.672-1.472-1.472 0-0.608 0.384-1.152 0.928-1.376-0.64-0.352-1.376-0.544-2.144-0.544-1.216 0-2.368 0.48-3.2 1.344-1.76 1.76-1.76 4.64 0 6.432 0.864 0.864 2.016 1.344 3.2 1.344 1.216 0 2.368-0.48 3.2-1.344l8.48-8.544c1.408-1.408 3.296-2.208 5.312-2.208s3.872 0.768 5.312 2.208c1.408 1.408 2.176 3.296 2.176 5.312s-0.768 3.872-2.208 5.312v0c0 0 0 0 0 0-1.408 1.408-3.296 2.176-5.28 2.176zM18.752 18.912l1.44 1.44c1.152 1.152 2.688 1.792 4.32 1.792s3.168-0.64 4.32-1.792v0c1.152-1.152 1.792-2.688 1.792-4.32s-0.64-3.168-1.792-4.32c-1.152-1.152-2.688-1.792-4.352-1.792-1.632 0-3.168 0.64-4.32 1.792l-8.48 8.448c-1.12 1.12-2.592 1.728-4.16 1.728s-3.072-0.608-4.16-1.728c-2.304-2.304-2.304-6.048 0-8.352 1.12-1.12 2.592-1.728 4.16-1.728s3.072 0.608 4.16 1.728l1.44 1.408h-2.912c-0.064 0-0.128 0.064-0.128 0.128s0.064 0.128 0.128 0.128h3.168c0.064 0 0.128-0.064 0.128-0.128v-3.168c0-0.064-0.064-0.128-0.128-0.128s-0.128 0.064-0.128 0.128v2.912l-1.408-1.408c-1.152-1.152-2.688-1.792-4.352-1.792-1.632 0-3.168 0.64-4.32 1.792-2.4 2.4-2.4 6.272 0 8.672 1.152 1.152 2.688 1.792 4.32 1.792s3.168-0.64 4.32-1.792l8.512-8.512c1.12-1.12 2.592-1.728 4.16-1.728s3.072 0.608 4.16 1.728c1.12 1.12 1.728 2.592 1.728 4.16s-0.608 3.072-1.728 4.16c-1.12 1.12-2.592 1.728-4.16 1.728s-3.072-0.608-4.16-1.728l-1.408-1.408h2.912c0.064 0 0.128-0.064 0.128-0.128s-0.064-0.128-0.128-0.128h-3.168c-0.064 0-0.128 0.064-0.128 0.128v3.168c0 0.064 0.064 0.128 0.128 0.128s0.128-0.064 0.128-0.128v-2.88z"></path>
      </symbol>
      <symbol id="icon-pause" viewBox="0 0 32 32">
        <title>icon-pause</title>
        <path d="M16 0.32c-8.64 0-15.68 7.040-15.68 15.68s7.040 15.68 15.68 15.68 15.68-7.040 15.68-15.68-7.040-15.68-15.68-15.68zM16 29.216c-7.296 0-13.216-5.92-13.216-13.216s5.92-13.216 13.216-13.216 13.216 5.92 13.216 13.216-5.92 13.216-13.216 13.216z"></path>
        <path d="M16 32c-8.832 0-16-7.168-16-16s7.168-16 16-16 16 7.168 16 16-7.168 16-16 16zM16 0.672c-8.448 0-15.328 6.88-15.328 15.328s6.88 15.328 15.328 15.328c8.448 0 15.328-6.88 15.328-15.328s-6.88-15.328-15.328-15.328zM16 29.568c-7.488 0-13.568-6.080-13.568-13.568s6.080-13.568 13.568-13.568c7.488 0 13.568 6.080 13.568 13.568s-6.080 13.568-13.568 13.568zM16 3.104c-7.104 0-12.896 5.792-12.896 12.896s5.792 12.896 12.896 12.896c7.104 0 12.896-5.792 12.896-12.896s-5.792-12.896-12.896-12.896z"></path>
        <path d="M12.16 22.336v0c-0.896 0-1.6-0.704-1.6-1.6v-9.472c0-0.896 0.704-1.6 1.6-1.6v0c0.896 0 1.6 0.704 1.6 1.6v9.504c0 0.864-0.704 1.568-1.6 1.568z"></path>
        <path d="M19.84 22.336v0c-0.896 0-1.6-0.704-1.6-1.6v-9.472c0-0.896 0.704-1.6 1.6-1.6v0c0.896 0 1.6 0.704 1.6 1.6v9.504c0 0.864-0.704 1.568-1.6 1.568z"></path>
      </symbol>
      <symbol id="icon-play" viewBox="0 0 32 32">
        <title>icon-play</title>
        <path d="M21.216 15.168l-7.616-5.088c-0.672-0.416-1.504 0.032-1.504 0.832v10.176c0 0.8 0.896 1.248 1.504 0.832l7.616-5.088c0.576-0.416 0.576-1.248 0-1.664z"></path>
        <path d="M13.056 22.4c-0.224 0-0.416-0.064-0.608-0.16-0.448-0.224-0.704-0.672-0.704-1.152v-10.176c0-0.48 0.256-0.928 0.672-1.152s0.928-0.224 1.344 0.064l7.616 5.088c0.384 0.256 0.608 0.672 0.608 1.088s-0.224 0.864-0.608 1.088l-7.616 5.088c-0.192 0.16-0.448 0.224-0.704 0.224zM13.056 10.272c-0.096 0-0.224 0.032-0.32 0.064-0.224 0.128-0.352 0.32-0.352 0.576v10.176c0 0.256 0.128 0.48 0.352 0.576 0.224 0.128 0.448 0.096 0.64-0.032l7.616-5.088c0.192-0.128 0.288-0.32 0.288-0.544s-0.096-0.416-0.288-0.544l-7.584-5.088c-0.096-0.064-0.224-0.096-0.352-0.096z"></path>
        <path d="M16 0.32c-8.64 0-15.68 7.040-15.68 15.68s7.040 15.68 15.68 15.68 15.68-7.040 15.68-15.68-7.040-15.68-15.68-15.68zM16 29.216c-7.296 0-13.216-5.92-13.216-13.216s5.92-13.216 13.216-13.216 13.216 5.92 13.216 13.216-5.92 13.216-13.216 13.216z"></path>
        <path d="M16 32c-8.832 0-16-7.168-16-16s7.168-16 16-16 16 7.168 16 16-7.168 16-16 16zM16 0.672c-8.448 0-15.328 6.88-15.328 15.328s6.88 15.328 15.328 15.328c8.448 0 15.328-6.88 15.328-15.328s-6.88-15.328-15.328-15.328zM16 29.568c-7.488 0-13.568-6.080-13.568-13.568s6.080-13.568 13.568-13.568c7.488 0 13.568 6.080 13.568 13.568s-6.080 13.568-13.568 13.568zM16 3.104c-7.104 0-12.896 5.792-12.896 12.896s5.792 12.896 12.896 12.896c7.104 0 12.896-5.792 12.896-12.896s-5.792-12.896-12.896-12.896z"></path>
      </symbol>
      <symbol id="icon-link" viewBox="0 0 32 32">
        <title>link</title>
        <path d="M23.584 17.92c0 0.864 0 1.728 0 2.56 0 1.312 0 2.656 0 3.968 0 0.352 0.032 0.736-0.032 1.12 0.032-0.16 0.032-0.288 0.064-0.448-0.032 0.224-0.096 0.448-0.16 0.64 0.064-0.128 0.128-0.256 0.16-0.416-0.096 0.192-0.192 0.384-0.32 0.576 0.096-0.128 0.16-0.224 0.256-0.352-0.128 0.16-0.288 0.32-0.48 0.48 0.128-0.096 0.224-0.16 0.352-0.256-0.192 0.128-0.352 0.256-0.576 0.32 0.128-0.064 0.256-0.128 0.416-0.16-0.224 0.096-0.416 0.16-0.64 0.16 0.16-0.032 0.288-0.032 0.448-0.064-0.256 0.032-0.512 0.032-0.768 0.032-0.448 0-0.896 0-1.312 0-1.472 0-2.976 0-4.448 0-1.824 0-3.616 0-5.44 0-1.568 0-3.104 0-4.672 0-0.736 0-1.44 0-2.176 0-0.128 0-0.224 0-0.352-0.032 0.16 0.032 0.288 0.032 0.448 0.064-0.224-0.032-0.448-0.096-0.64-0.16 0.128 0.064 0.256 0.128 0.416 0.16-0.192-0.096-0.384-0.192-0.576-0.32 0.128 0.096 0.224 0.16 0.352 0.256-0.16-0.128-0.32-0.288-0.48-0.48 0.096 0.128 0.16 0.224 0.256 0.352-0.128-0.192-0.256-0.352-0.32-0.576 0.064 0.128 0.128 0.256 0.16 0.416-0.096-0.224-0.16-0.416-0.16-0.64 0.032 0.16 0.032 0.288 0.064 0.448-0.032-0.256-0.032-0.512-0.032-0.768 0-0.448 0-0.896 0-1.312 0-1.472 0-2.976 0-4.448 0-1.824 0-3.616 0-5.44 0-1.568 0-3.104 0-4.672 0-0.736 0-1.44 0-2.176 0-0.128 0-0.224 0.032-0.352-0.032 0.16-0.032 0.288-0.064 0.448 0.032-0.224 0.096-0.448 0.16-0.64-0.064 0.128-0.128 0.256-0.16 0.416 0.096-0.192 0.192-0.384 0.32-0.576-0.096 0.128-0.16 0.224-0.256 0.352 0.128-0.16 0.288-0.32 0.48-0.48-0.128 0.096-0.224 0.16-0.352 0.256 0.192-0.128 0.352-0.256 0.576-0.32-0.128 0.064-0.256 0.128-0.416 0.16 0.224-0.096 0.416-0.16 0.64-0.16-0.16 0.032-0.288 0.032-0.448 0.064 0.48-0.064 0.96-0.032 1.44-0.032 0.992 0 1.952 0 2.944 0 1.216 0 2.432 0 3.616 0 1.056 0 2.112 0 3.168 0 0.512 0 1.024 0 1.536 0 0 0 0 0 0.032 0 0.448 0 0.896-0.192 1.184-0.48s0.512-0.768 0.48-1.184c-0.032-0.448-0.16-0.896-0.48-1.184s-0.736-0.48-1.184-0.48c-0.64 0-1.28 0-1.92 0-1.408 0-2.816 0-4.224 0-1.44 0-2.848 0-4.256 0-0.672 0-1.344 0-2.016 0-0.736 0-1.472 0.192-2.112 0.576s-1.216 0.96-1.568 1.6c-0.384 0.64-0.544 1.376-0.544 2.144 0 0.672 0 1.376 0 2.048 0 1.28 0 2.56 0 3.84 0 1.504 0 3.040 0 4.544 0 1.408 0 2.848 0 4.256 0 0.992 0 1.952 0 2.944 0 0.224 0 0.448 0 0.64 0 0.864 0.224 1.76 0.768 2.464 0.16 0.192 0.288 0.384 0.48 0.576s0.384 0.352 0.608 0.512c0.32 0.224 0.64 0.384 1.024 0.512 0.448 0.16 0.928 0.224 1.408 0.224 0.16 0 0.32 0 0.48 0 0.896 0 1.792 0 2.72 0 1.376 0 2.784 0 4.16 0 1.536 0 3.040 0 4.576 0 1.312 0 2.656 0 3.968 0 0.768 0 1.536 0 2.336 0 0.416 0 0.832-0.032 1.248-0.128 1.504-0.32 2.784-1.6 3.104-3.104 0.128-0.544 0.128-1.056 0.128-1.568 0-0.608 0-1.184 0-1.792 0-1.408 0-2.816 0-4.224 0-0.256 0-0.512 0-0.768 0-0.448-0.192-0.896-0.48-1.184s-0.768-0.512-1.184-0.48c-0.448 0.032-0.896 0.16-1.184 0.48-0.384 0.384-0.576 0.768-0.576 1.248v0z"></path>
        <path d="M32 11.232c0-0.8 0-1.568 0-2.368 0-1.248 0-2.528 0-3.776 0-0.288 0-0.576 0-0.864 0-0.896-0.768-1.696-1.696-1.696-0.8 0-1.568 0-2.368 0-1.248 0-2.528 0-3.776 0-0.288 0-0.576 0-0.864 0-0.448 0-0.896 0.192-1.184 0.48s-0.512 0.768-0.48 1.184c0.032 0.448 0.16 0.896 0.48 1.184s0.736 0.48 1.184 0.48c0.8 0 1.568 0 2.368 0 1.248 0 2.528 0 3.776 0 0.288 0 0.576 0 0.864 0-0.576-0.576-1.12-1.12-1.696-1.696 0 0.8 0 1.568 0 2.368 0 1.248 0 2.528 0 3.776 0 0.288 0 0.576 0 0.864 0 0.448 0.192 0.896 0.48 1.184s0.768 0.512 1.184 0.48c0.448-0.032 0.896-0.16 1.184-0.48 0.352-0.256 0.544-0.64 0.544-1.12v0z"></path>
        <path d="M15.040 21.888c0.16-0.16 0.288-0.288 0.448-0.448 0.384-0.384 0.8-0.8 1.184-1.184 0.608-0.608 1.184-1.184 1.792-1.792 0.704-0.704 1.44-1.44 2.176-2.176 0.8-0.8 1.568-1.568 2.368-2.368s1.6-1.6 2.4-2.4c0.736-0.736 1.504-1.504 2.24-2.24 0.64-0.64 1.248-1.248 1.888-1.888 0.448-0.448 0.896-0.896 1.344-1.344 0.224-0.224 0.448-0.416 0.64-0.64 0 0 0.032-0.032 0.032-0.032 0.32-0.32 0.48-0.768 0.48-1.184s-0.192-0.896-0.48-1.184c-0.32-0.288-0.736-0.512-1.184-0.48-0.512 0.032-0.928 0.16-1.248 0.48-0.16 0.16-0.288 0.288-0.448 0.448-0.384 0.384-0.8 0.8-1.184 1.184-0.608 0.608-1.184 1.184-1.792 1.792-0.704 0.704-1.44 1.44-2.176 2.176-0.8 0.8-1.568 1.568-2.368 2.368s-1.6 1.6-2.4 2.4c-0.736 0.736-1.504 1.504-2.24 2.24-0.64 0.64-1.248 1.248-1.888 1.888-0.448 0.448-0.896 0.896-1.344 1.344-0.224 0.224-0.448 0.416-0.64 0.64 0 0-0.032 0.032-0.032 0.032-0.32 0.32-0.48 0.768-0.48 1.184s0.192 0.896 0.48 1.184c0.32 0.288 0.736 0.512 1.184 0.48 0.48 0 0.928-0.16 1.248-0.48v0z"></path>
      </symbol>
      <symbol id="icon-next" viewBox="0 0 32 32">
        <title>next</title>
        <path d="M2.304 18.304h14.688l-4.608 4.576c-0.864 0.864-0.864 2.336 0 3.232 0.864 0.864 2.336 0.864 3.232 0l8.448-8.48c0.864-0.864 0.864-2.336 0-3.232l-8.448-8.448c-0.448-0.448-1.056-0.672-1.632-0.672s-1.184 0.224-1.632 0.672c-0.864 0.864-0.864 2.336 0 3.232l4.64 4.576h-14.688c-1.248 0-2.304 0.992-2.304 2.272s1.024 2.272 2.304 2.272z"></path>
        <path d="M29.696 26.752c1.248 0 2.304-1.024 2.304-2.304v-16.928c0-1.248-1.024-2.304-2.304-2.304s-2.304 1.024-2.304 2.304v16.928c0.064 1.28 1.056 2.304 2.304 2.304z"></path>
      </symbol>
      <symbol id="icon-prev" viewBox="0 0 32 32">
        <title>prev</title>
        <path d="M29.696 13.696h-14.688l4.576-4.576c0.864-0.864 0.864-2.336 0-3.232-0.864-0.864-2.336-0.864-3.232 0l-8.448 8.48c-0.864 0.864-0.864 2.336 0 3.232l8.448 8.448c0.448 0.448 1.056 0.672 1.632 0.672s1.184-0.224 1.632-0.672c0.864-0.864 0.864-2.336 0-3.232l-4.608-4.576h14.688c1.248 0 2.304-1.024 2.304-2.304s-1.024-2.24-2.304-2.24z"></path>
        <path d="M2.304 5.248c-1.248 0-2.304 1.024-2.304 2.304v16.928c0 1.248 1.024 2.304 2.304 2.304s2.304-1.024 2.304-2.304v-16.928c-0.064-1.28-1.056-2.304-2.304-2.304z"></path>
      </symbol>
    </defs>
  </svg>
  </div>
</template>

<script>
export default {
  name: "MusicPlayer",
  props:["musicOn"],
  data() {
    return {
      USER_ID: this.$store.state.user_id,
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      listClick:false,
      isRandom:false,
      isSingle:false,
      isInitial:false,
      randomTrackIndex:[],
      tracks: [{
        name: "啥歌都没有",
        artist: "你是想自己唱吗？",
        cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/1.jpg",
        node_id:-1,
        source: "",
        favorited: false,
        shared:false,
      }],
      currentTrack: null,
      currentTrackIndex: 0,
      currentRandomTrackIndex: 0,
      transitionName: null,
      volumeValue:50,
      volumeState:'volume-up-fill',
      show: true,


      nameTimer:null,
      trackTimer:null,
      nameStep:null,
      trackStep:null,
      nameDirection:false,
      trackDirection:false,
      nameStopFlag:false,
      trackStopFlag:false,

    };
  },
  methods: {
    removeSong(row){
      this.$socket.emit("deleteSong",this.tracks[row].node_id,this.tracks[row].user_id);
    },
    async realRemoveSong(row){
      if(this.isRandom){
        if(row < this.currentRandomTrackIndex){
          this.transitionName = "none";
          await this.$store.dispatch("musicState/removeSongFromListAsync",row);
          this.currentRandomTrackIndex = this.currentRandomTrackIndex-1;
          this.currentTrackIndex = this.randomTrackIndex.indexOf(this.currentRandomTrackIndex);
        }
        else if(row === this.currentRandomTrackIndex){
          await this.$store.dispatch("musicState/removeSongFromListAsync",row);
          if(this.currentRandomTrackIndex > 0){
            this.currentRandomTrackIndex = this.currentRandomTrackIndex-1;
            this.currentTrackIndex = this.randomTrackIndex.indexOf(this.currentRandomTrackIndex);
            this.nextTrack();
          }
          else{
            this.changeSong(0);
          }
        }
        else{
          await this.$store.dispatch("musicState/removeSongFromListAsync",row);
        }
      }else{
        if(row < this.currentTrackIndex){
          this.transitionName = "none";
          await this.$store.dispatch("musicState/removeSongFromListAsync",row);
          this.currentTrackIndex = this.currentTrackIndex-1;
        }
        else if(row === this.currentTrackIndex){
          await this.$store.dispatch("musicState/removeSongFromListAsync",row);
          if(this.currentTrackIndex > 0){
            this.currentTrackIndex = this.currentTrackIndex-1;
            this.nextTrack();
          }
          else{
            this.changeSong(0);
          }
        }
        else{
          await this.$store.dispatch("musicState/removeSongFromListAsync",row);
        }
      }

    },
    async changeSongWithPlay(row){
      await this.changeSong(row);
      if (this.audio.paused) {
        this.audio.play();
        this.isTimerPlaying = true;
      }
    },
    changeSong(row){
        if(this.currentTrackIndex > row){
          this.transitionName = "scale-in";
        }else{
          this.transitionName = "scale-out";
        }
        this.isShowCover = false;

        if(this.isRandom){
          this.currentRandomTrackIndex = row;
          this.currentTrackIndex = row;
          this.currentTrack = this.tracks[this.currentRandomTrackIndex];
          this.shuffle();
        }else{
          this.currentTrackIndex = row;
          this.currentTrack = this.tracks[this.currentTrackIndex];
        }

        this.resetPlayer();
    },
    switchShow(){
      this.show = !this.show;
      if(this.show){
        setTimeout(()=>{this.rollingName();},300);
      }
    },
    changeClass(){
      this.$emit("musicPlayerChangeClass");
    },
    randomModeOn(){
      this.isRandom = !this.isRandom;
      this.isSingle = false;
      if(this.isRandom){
        this.currentRandomTrackIndex = this.currentTrackIndex;
      }else{
        this.currentTrackIndex = this.currentRandomTrackIndex;
      }

    },
    singleModeOn(){
      if(this.isRandom){
        this.currentTrackIndex = this.currentRandomTrackIndex;
      }
      this.isRandom = false;
      this.isSingle = !this.isSingle;


    },
    play() {
      if(this.tracks[this.currentTrackIndex].node_id !== -1){
        if (this.audio.paused) {
          this.audio.play();
          this.isTimerPlaying = true;
        } else {
          this.audio.pause();
          this.isTimerPlaying = false;
        }
      }
    },
    generateTime() {
      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(this.audio.duration / 60);
      let dursec = Math.floor(this.audio.duration - durmin * 60);
      let curmin = Math.floor(this.audio.currentTime / 60);
      let cursec = Math.floor(this.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (maxduration * percentage) / 100;
      this.audio.play();
    },
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.audio.pause();
      this.updateBar(e.offsetX);
    },
    changeVolume(e) {
      this.audio.volume = e / 100;
    },
    changeMute(e){
      if(this.audio.volume !== 0){
        this.volumeValue = 0;
      }else{
        this.volumeValue = 100;
      }
    },
    prevTrack() {
      if(this.tracks[this.currentTrackIndex].node_id !== -1) {
        this.transitionName = "scale-in";
        this.isShowCover = false;

        if (this.currentTrackIndex > 0) {
          this.currentTrackIndex--;
        } else {
          this.currentTrackIndex = this.tracks.length - 1;
        }
        if(this.isRandom){
          this.currentRandomTrackIndex = this.randomTrackIndex[this.currentTrackIndex];
          this.currentTrack = this.tracks[this.currentRandomTrackIndex];
        }else{
          this.currentTrack = this.tracks[this.currentTrackIndex];
        }
        this.resetPlayer();
      }
    },
    nextTrack(e) {
      if(this.tracks[this.currentTrackIndex].node_id !== -1) {
        this.transitionName = "scale-out";
        this.isShowCover = false;
        //判断是否为单曲循环 但如果为点击 则依旧前进
        if(this.isSingle && !(e)){
          this.currentTrack = this.tracks[this.currentTrackIndex];
          this.resetPlayer();
        }else{
          if (this.currentTrackIndex < this.tracks.length - 1) {
            this.currentTrackIndex++;
          } else {
            this.currentTrackIndex = 0;
          }

          if(this.isRandom){
            this.currentRandomTrackIndex = this.randomTrackIndex[this.currentTrackIndex];
            this.currentTrack = this.tracks[this.currentRandomTrackIndex];
          }else{
            this.currentTrack = this.tracks[this.currentTrackIndex];
          }
          this.resetPlayer();
        }

      }
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.source;
      setTimeout(() => {
        if(this.show){
          this.rollingName();
        }
        if(this.isTimerPlaying) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }, 300);

    },


    async changeFavorite(event){
      if(this.tracks[this.currentTrackIndex].node_id !== -1) {
        if (this.tracks[this.currentTrackIndex].favorited) {
          let {data: res} = await this.$http.post("/file/favoriteFile", {
            user_id: this.$store.state.user_id,
            node_id: this.tracks[this.currentTrackIndex].node_id,
            is_favorites: false
          }).catch((error) => {
                if (error.status !== 401) {
                  this.$message.error('收藏删减出现未知问题，请联系Van！ Code:' + error.message);
                }
              }
          );
          if (res.code === 200) {
            await this.$store.dispatch("updateChangeFavIdAsync", this.tracks[this.currentTrackIndex].node_id + "s" + Date.now());
            this.$socket.emit("changeFav",this.tracks[this.currentTrackIndex].node_id,this.tracks[this.currentTrackIndex].user_id,false);
            this.$notify(
                {
                  title: '移除收藏成功',
                  type: 'error',
                  message: `${this.tracks[this.currentTrackIndex].name}已不再是我所爱！`,
                  position: 'bottom-right',
                  customClass: "message",
                }
            );
          }
        } else {
          let {data: res} = await this.$http.post("/file/favoriteFile", {
            user_id: this.$store.state.user_id,
            node_id: this.tracks[this.currentTrackIndex].node_id,
            is_favorites: true
          });
          if (res.code === 200) {
            await this.$store.dispatch("updateChangeFavIdAsync", this.tracks[this.currentTrackIndex].node_id + "s" + Date.now());
            this.$socket.emit("changeFav",this.tracks[this.currentTrackIndex].node_id,this.tracks[this.currentTrackIndex].user_id,true);
            this.$notify(
                {
                  title: '添加收藏成功',
                  type: 'success',
                  message: `${this.tracks[this.currentTrackIndex].name}已添加至我的收藏！`,
                  position: 'bottom-right',
                  customClass: "message",
                }
            );
          }
        }
      }
    },
    async changeShared(){
      if(this.tracks[this.currentTrackIndex].node_id !== -1) {
        if (this.tracks[this.currentTrackIndex].shared) {

          let {data: res} = await this.$http.post("/share/shareFile", {
            user_id: this.$store.state.user_id,
            node_id: this.tracks[this.currentTrackIndex].node_id,
            is_shared: false
          }).catch((error) => {
                if (error.status !== 401) {
                  this.$message.error('分享删减出现未知问题，请联系Van！ Code:' + error.message);
                }
              }
          );

          if (res.code === 200) {
            await this.$store.dispatch("updateChangeSharedIdAsync", this.tracks[this.currentTrackIndex].node_id+ "s" + Date.now());
            this.$socket.emit("changeShare",this.tracks[this.currentTrackIndex].node_id,this.tracks[this.currentTrackIndex].user_id,false);
            this.$notify(
                {
                  title: '取消分享成功',
                  type: 'error',
                  message: `${this.tracks[this.currentTrackIndex].name}不再能被其他镇民访问！`,
                  position: 'bottom-right',
                  customClass: "message",
                }
            );
          }
        } else {
          let {data: res} = await this.$http.post("/share/shareFile", {
            user_id: this.$store.state.user_id,
            node_id: this.tracks[this.currentTrackIndex].node_id,
            is_shared: true
          }).catch((error) => {
                if (error.status !== 401) {
                  this.$message.error('分享删减出现未知问题，请联系Van！ Code:' + error.message);
                }
              }
          );
          if (res.code === 200) {
            await this.$store.dispatch("updateChangeSharedIdAsync", this.tracks[this.currentTrackIndex].node_id+ "s" + Date.now());
            this.$socket.emit("changeShare",this.tracks[this.currentTrackIndex].node_id,this.tracks[this.currentTrackIndex].user_id,true);
            this.$notify(
                {
                  title: '分享成功',
                  type: 'success',
                  message: `${this.tracks[this.currentTrackIndex].name}已经分享至大咕咕广场，可被所有镇民访问！`,
                  position: 'bottom-right',
                  customClass: "message",
                }
            );
          }
        }
      }
    },
    shuffle(){
      let l = this.randomTrackIndex.length;
      for(let i = l - 1; i >= 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));  //随机索引值randomIndex是从0-arr.length中随机抽取的，因为Math.floor()方法是向下取整的，所以这里是i+1
        //下面三句相当于把从数组中随机抽取到的值与当前遍历的值互换位置
        let temp = this.randomTrackIndex[randomIndex];
        this.randomTrackIndex[randomIndex] =this.randomTrackIndex[i];
        this.randomTrackIndex[i] = temp;
      }
    },

    rollingName(){
        clearInterval(this.nameTimer);
        clearInterval(this.trackTimer);
        clearTimeout(this.nameStep);
        clearTimeout(this.trackStep);
        this.nameDirection = false;
        this.trackDirection = false;
        let tmp = document.querySelector(".album-info__name");
        if(tmp.scrollWidth > tmp.clientWidth){
          this.nameTimer = setInterval(()=>{
            if(this.nameDirection){
              tmp.scrollLeft++;
            }
            else{
              tmp.scrollLeft--;
            }
            if(tmp.scrollLeft >= (tmp.scrollWidth - tmp.clientWidth)){
              this.nameDirection = !this.nameDirection;
              this.nameStopFlag = !this.nameStopFlag;
            }
            if(tmp.scrollLeft <= 0){
              this.nameDirection = !this.nameDirection;
              this.nameStopFlag = !this.nameStopFlag;
            }
          },60);

        }
        let tmp2 = document.querySelector(".album-info__track");
        if(tmp2.scrollWidth > tmp2.clientWidth) {
          this.trackTimer = setInterval(() => {
            if (this.trackDirection) {
              tmp2.scrollLeft++;
            } else {
              tmp2.scrollLeft--;
            }

            if (tmp2.scrollLeft >= (tmp2.scrollWidth-tmp2.clientWidth)) {
              this.trackDirection = !this.trackDirection;
              this.trackStopFlag = !this.trackStopFlag;
            }
            if (tmp2.scrollLeft <= 0) {
              this.trackDirection = !this.trackDirection;
              this.trackStopFlag = !this.trackStopFlag;
            }
          }, 60);
        }
    }
  },

  sockets:{
    newSongAdded(data){
      this.$store.commit('musicState/updatePlayList',[data.source,data.shared,data.favorited,data.node_id,data.file_name,data.artist,data.name,data.cover,data.user_id]);
    },
    newSongsAdded(data){
      this.$store.commit('musicState/updatePlayListWithMulti',data);
    },
    songList(data){
      this.$store.commit('musicState/initialPlayList',data);
      this.isInitial = true;
    },
    songDeleted(data){
      let row;
      for(let [index, el] of this.tracks.entries()){
        if(el.node_id === data[0] && el.user_id === data[1]){
          row = index;
          break;
        }
      }
      this.realRemoveSong(row);
      console.log("删除的node-id： "+ data[0] + ",删除的node-id： "+ data[1]);
    }
  },
  computed:{
    monitor(){
      return this.$store.state.musicState.nowPlayIndex;
    },
    musicListMonitor(){
      return this.$store.state.musicState.playList;
    },
    FavIdMonitor(){
      return this.$store.state.changeFavId;
    },
    SharedIdMonitor(){
      return this.$store.state.changeSharedId;
    }
  },
  watch:{
    FavIdMonitor:{
      handler(val){
        let realVal = Number(val.slice(0,val.indexOf("s")));
        this.$store.dispatch("musicState/updatePlayListFavAsync",realVal);
      }
    },
    SharedIdMonitor:{
      handler(val){
        let realVal = Number(val.slice(0,val.indexOf("s")));
        this.$store.dispatch("musicState/updatePlayListShareAsync",realVal);
      }
    },
    musicListMonitor:{
      handler(val){
        this.randomTrackIndex=[];
        if(val.length!==0){
          this.tracks = this.$store.state.musicState.playList;
          for(let i = 0; i<this.tracks.length; i++){
            this.randomTrackIndex.push(i);
          }
          //Fisher–Yates shuffle
          this.shuffle();
        }
        else{
          this.tracks = [{
            name: "啥歌都没有",
            artist: "你是想自己唱吗？",
            cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/1.jpg",
            node_id:-1,
            source: "",
            favorited: false,
            shared:false,
          }];
          this.randomTrackIndex = [0];
        }

        if(this.isInitial){
          this.isInitial = false;
          this.currentTrackIndex = 0;
          this.currentTrack = this.tracks[this.currentTrackIndex];
          this.resetPlayer();
        }
      },
      immediate:true,
    },
    'volumeValue':{
      handler(val){
        if(val === 0){
          this.volumeState = "volume-mute-fill";
        }else if(val > 0 && val <= 30){
          this.volumeState = "volume-down-fill";
        }else if(val > 30 && val <= 100){
          this.volumeState = "volume-up-fill";
        }
      }
    },
    'show':{
      handler(val){
        const body = document.querySelector("body");
        if(!val){
          body.style.overflow = "hidden";
        }else{
          setTimeout(()=>{body.style.overflow = "visible";},400)
        }

      }
    },
    monitor:{
      handler(val){
        //反了 isOnlyAddList为true 代表是直接打开
        if(this.$store.state.musicState.isOnlyAddList){
          this.currentTrackIndex = Number(val.substring(0,val.indexOf('s')));
          this.transitionName = "scale-out";
          this.isShowCover = false;
          this.currentTrack = this.tracks[this.currentTrackIndex];
          this.resetPlayer();
          this.audio.play();
          this.isTimerPlaying = true;
        }else{
          if(this.$store.state.musicState.isRepeat){
            this.$notify(
                {
                  title: '此曲列表已有',
                  type: 'warning',
                  message: `${this.tracks[Number(val.substring(0,val.indexOf('s')))].file_name}已存在在播放列表之中！`,
                  position: 'bottom-right',
                  customClass: "message",
                }
            );
            this.$store.dispatch("musicState/recoverRepeatFlagAsync");
          }else{
            this.$notify(
                {
                  title: '添加歌曲成功',
                  type: 'success',
                  message: `${this.tracks[Number(val.substring(0,val.indexOf('s')))].file_name}已成功添加！`,
                  position: 'bottom-right',
                  customClass: "message",
                }
            );
          }

        }
      },
    },
    'musicOn':{
      handler(val){
        if(val === false && this.isTimerPlaying === true){
          this.audio.pause();
          this.isTimerPlaying = false;
        }
      }
    },
    'nameStopFlag':{
      handler(val){
        clearInterval(this.nameTimer);
        let tmp = document.querySelector(".album-info__name");
        this.nameStep = setTimeout(()=>{this.nameTimer = setInterval(()=>{
          if(this.nameDirection){
            tmp.scrollLeft++;
          }
          else{
            tmp.scrollLeft--;
          }
          if(tmp.scrollLeft >= (tmp.scrollWidth - tmp.clientWidth)){
            this.nameDirection = !this.nameDirection;
            this.nameStopFlag = !this.nameStopFlag;
          }
          if(tmp.scrollLeft <= 0){
            this.nameDirection = !this.nameDirection;
            this.nameStopFlag = !this.nameStopFlag;
          }
        },60);},3000);
      }
    },
    'trackStopFlag':{
      handler(val){
        clearInterval(this.trackTimer);
        let tmp2 = document.querySelector(".album-info__track");
        this.trackStep = setTimeout(()=>{this.trackTimer = setInterval(() => {
          if (this.trackDirection) {
            tmp2.scrollLeft++;
          } else {
            tmp2.scrollLeft--;
          }

          if (tmp2.scrollLeft >= (tmp2.scrollWidth-tmp2.clientWidth)) {
            this.trackDirection = !this.trackDirection;
            this.trackStopFlag = !this.trackStopFlag;
          }
          if (tmp2.scrollLeft <= 0) {
            this.trackDirection = !this.trackDirection;
            this.trackStopFlag = !this.trackStopFlag;
          }
        }, 60);},3000);
      }
    }
  },
  created() {
    let vm = this;
    this.currentTrack = this.tracks[0];
    this.audio = new Audio();
    if(this.currentTrack.node_id !== -1){
      this.audio.src = this.currentTrack.source;
    }
    this.audio.ontimeupdate = function() {
      vm.generateTime();
    };
    this.audio.onloadedmetadata = function() {
      vm.generateTime();
    };
    this.audio.onended = function() {
      vm.nextTrack();
      this.isTimerPlaying = true;
    };

    // this is optional (for preload covers)
    for (let index = 0; index < this.tracks.length; index++) {
      const element = this.tracks[index];
      let link = document.createElement('link');
      link.rel = "prefetch";
      link.href = element.cover;
      link.as = "image"
      document.head.appendChild(link)
    }
  },

}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.musicPlayer{
  position: absolute;
  bottom: 5%;
  right: 0%;
  transition: all .3s ease-in-out;
  z-index: 20;
}
.musicPlayer.hide{
  position: absolute;
  min-width: 330px;
  min-height: 463px;
  bottom: 5%;
  right: -300px;
  transition: all .3s ease-in-out;

}
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
}

.wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  // background: url(../img/bg.png) no-repeat center;
  background-size: cover;
  @media screen and (max-width: 700px), (max-height: 500px) {
    flex-wrap: wrap;
    flex-direction: column;
  }
}

.player {
  background: #444857;
  width: 330px;
  min-height: 400px;
  // box-shadow: 0px 55px 75px -10px rgba(76, 70, 124, 0.5);
  // box-shadow: 0px 55px 105px 10px rgba(76, 70, 124, 0.35);
  box-shadow: 0px 15px 35px -5px rgba(50, 88, 130, 0.32);
  border-radius: 15px;
  padding: 20px;
  @media screen and (max-width: 576px), (max-height: 500px) {
    width: 95%;
    padding: 20px;
    margin-top: 75px;
    min-height: initial;
    padding-bottom: 30px;
    max-width: 400px;
  }
  &__top {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    position: relative;
    z-index: 4;
    @media screen and (max-width: 576px), (max-height: 500px) {
      flex-wrap: wrap;
    }
  }

  &-cover {
    width: 250px;
    height: 250px;
    margin-left: -70px;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
    border-radius: 15px;
    // transform: perspective(512px) translate3d(0, 0, 0);
    // transition: all .4s cubic-bezier(.125, .625, .125, .875);
    z-index: 1;

    @media screen and (max-width: 576px), (max-height: 500px) {
      margin-top: -70px;
      margin-bottom: 25px;
      width: 250px;
      height: 230px;
      margin-left: auto;
      margin-right: auto;
    }

    &__item {
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      width: 100%;
      height: 100%;
      border-radius: 15px;
      position: absolute;
      left: 0;
      top: 0;

      &:before {
        content: "";
        background: inherit;
        width: 100%;
        height: 100%;
        box-shadow: 0px 10px 40px 0px rgba(76, 70, 124, 0.5);
        display: block;
        z-index: 1;
        position: absolute;
        top: 30px;
        transform: scale(0.9);
        filter: blur(10px);
        opacity: 0.9;
        border-radius: 15px;
      }

      &:after {
        content: "";
        background: inherit;
        width: 100%;
        height: 100%;
        box-shadow: 0px 10px 40px 0px rgba(76, 70, 124, 0.5);
        display: block;
        z-index: 2;
        position: absolute;
        border-radius: 15px;
      }
    }

    &__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 15px;
      box-shadow: 0px 10px 40px 0px rgba(76, 70, 124, 0.5);
      user-select: none;
      pointer-events: none;
    }
  }

  &-controls {
    flex: 0.5;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media screen and (max-width: 576px), (max-height: 500px) {
      flex-direction: row;
      padding-left: 0;
      width: 100%;
      flex: unset;
    }

    &__item {
      display: inline-flex;
      font-size: 40px;
      padding: 5px;
      margin-bottom: 10px;
      color: #acb8cc;
      cursor: pointer;
      width: 35px;
      height: 35px;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.3s ease-in-out;

      @media screen and (max-width: 576px), (max-height: 500px) {
        font-size: 26px;
        padding: 5px;
        margin-right: 10px;
        color: #acb8cc;
        cursor: pointer;
        width: 40px;
        height: 40px;
        margin-bottom: 0;
      }




      &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #fff;
        transform: scale(0.5);
        opacity: 0;
        box-shadow: 0px 5px 10px 0px rgba(76, 70, 124, 0.2);
        transition: all 0.3s ease-in-out;
        transition: all 0.4s cubic-bezier(0.35, 0.57, 0.13, 0.88);
      }

      @media screen and (min-width: 500px) {
        &:hover {
          color: #532ab9;

          &::before {
            opacity: 1;
            transform: scale(1.3);
          }
        }
      }

      @media screen and (max-width: 576px), (max-height: 500px) {
        &:active {
          color: #532ab9;

          &::before {
            opacity: 1;
            transform: scale(1.3);
          }
        }
      }

      .icon {
        position: relative;
        z-index: 2;
      }

      &.-xl {
        margin-bottom: 0;
        font-size: 65px;
        // filter: drop-shadow(0 2px 8px rgba(172, 184, 204, 0.3));
        // filter: drop-shadow(0 9px 6px rgba(172, 184, 204, 0.35));
        filter: drop-shadow(0 11px 6px rgba(172, 184, 204, 0.45));
        color: #ececec;
        width: auto;
        height: auto;
        display: inline-flex;
        @media screen and (max-width: 576px), (max-height: 500px) {
          margin-left: auto;
          font-size: 75px;
          margin-right: 0;
        }
        &:before {
          display: none;
        }
      }

      &.-favorite {
        &.active {
          color: #FFD580;
        }
      }

      &.-shared {
        &.active {
          color: #92d050;
        }
      }
    }
  }
}
[v-cloak] {
  display: none;
}
[v-cloak] > * {
  display: none;
}
.progress {
  width: 100%;
  margin-top: 15px;
  user-select: none;
  &__top {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  &__duration {
    color: #fdfeff;
    font-weight: 700;
    font-size: 20px;
    opacity: 0.7;
  }
  &__time {
    margin-top: 2px;
    color: #a5c6dc;
    font-weight: 700;
    font-size: 16px;
    opacity: 0.7;
  }
}
.progress__bar {
  height: 6px;
  width: 100%;
  cursor: pointer;
  background-color: #d8dde1;
  display: inline-block;
  border-radius: 10px;
}
.progress__current {
  height: inherit;
  width: 0%;
  background-color: #6d93d5;
  border-radius: 10px;
}

.album-info {
  color: #cfd7e0;
  flex: 1;
  padding-right: 60px;
  user-select: none;
  overflow: hidden;
  @media screen and (max-width: 576px), (max-height: 500px)  {
    padding-right: 30px;
  }

  &__name {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 6px;
    line-height: 1.1em;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space:nowrap;
    @media screen and (max-width: 576px), (max-height: 500px) {
      font-size: 18px;
      margin-bottom: 9px;
    }
  }
  &__name::-webkit-scrollbar{
    display: none;
  }
  &__track {
    font-weight: 400;
    font-size: 16px;
    opacity: 0.7;
    line-height: 1.3em;
    min-height: 32px;
    overflow-x: scroll;
    overflow-y: hidden;
    @media screen and (max-width: 576px), (max-height: 500px)  {
      font-size: 18px;
      min-height: 50px;
    }
  }
  &__track::-webkit-scrollbar{
    display: none;
  }
}
.list{
  position: absolute;
  top: 290px;
  z-index:9;
}
.shuffle{
  position: absolute;
  top: 290px;
  left: 60px;
  z-index:9;
  &.active {
    color: #13f1d9;
  }
}

.single{
  position: absolute;
  top: 290px;
  left: 100px;
  z-index:9;
  &.active {
    color: #F6EA00FF;
  }
}
.player-cover.small{
  position: absolute;
  width: 250px;
  height: 250px;
  top:20px;
  left: 35px;
  transition: all .3s ease-in-out;
  z-index: 8;
}

.player-cover.small:hover{
  cursor: pointer;
  transform: translateX(30px);
}
.player-cover.hide{
  position: absolute;
  width: 150px;
  height: 150px;
  z-index: 8;
  top:300px;
  margin-left: 0;
  left: 0px;
  transition: all .3s ease-in-out;
}
.player-cover.hide:hover{
  cursor: pointer;
  transform: translateX(-30px);
}
//scale out

.scale-out-enter-active {
  transition: all .35s ease-in-out;
}
.scale-out-leave-active {
  transition: all .35s ease-in-out;
}
.scale-out-enter {
  transform: scale(.55);
  pointer-events: none;
  opacity: 0;
}
.scale-out-leave-to {
  transform: scale(1.2);
  pointer-events: none;
  opacity: 0;
}


//scale in

.scale-in-enter-active {
  transition: all .35s ease-in-out;
}
.scale-in-leave-active {
  transition: all .35s ease-in-out;
}
.scale-in-enter {
  transform: scale(1.2);
  pointer-events: none;
  opacity: 0;
}
.scale-in-leave-to {
  transform: scale(.55);
  pointer-events: none;
  opacity: 0;
}

.cover-enter-active{
  transition: all .3s ease-in-out;
}
.cover-leave-active{
  transition: all .3s ease-in-out;
}
.cover-enter{
  transform: scale(0.1);
  opacity: 0;
}
.cover-leave-to{
  transform: scale(0.1);
  opacity: 0;
}

.listIcon{
  margin: 0 3px;
  font-size: 1.2em;
  transition: color 0.3s ease-in-out;
  cursor: pointer;
}
.listIcon.bi-play-circle:hover{
  color: greenyellow;
}

.listIcon.bi-x-circle:hover{
  color: red;
}


</style>
<style scoped>
.container{
  position: relative;
  width: 100%;
  height: 400px;

}
.tmpTable{
  background: #1e1f26;
}

.container >>> .el-table--enable-row-hover .el-table__body tr:hover>td {
  background-color: #A85DC3;

}

.container >>> .el-table th.gutter{   /*解决el-table加了gutter后 边框出现白边*/
  background:#1e1f26;
}

.container >>> .el-table__row>td,.container >>>  .el-table th.is-leaf{
  border: none;
}
.container .el-table::before{
  height: 0;
}


/deep/ .el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
  height: 6px;

}

/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #a49f9f;
  border-radius: 3px;
}
</style>
<style>
.volumePop.el-popover{
  min-width: max-content;
}
</style>
