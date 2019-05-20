<template>
  <div id="sheet-details">
    <div class="px-2 pt-6 h-full flex flex-col">
      <div class="sheet-info px-4">
        <img :src="sheet.thumb"/>
        <div class="flex flex-col flex-grow ml-4">
          <span class="name">{{sheet.name}}</span>
          <div class="flex mt-4">
            <span v-for="(tag, index) in sheet.tags"
                  :key="index"
                  class="mr-2 text-sm text-black3">#{{tag}}</span>
          </div>
          <div class="flex flex-col flex-grow justify-end">
            <span class="text-sm text-black6">{{sheet.desc}}</span>
          </div>
        </div>
      </div>
      <div class="controls mt-5 px-4">
        <el-button plain size="small">
          <sk-icon type="sk-play"/>播放全部
        </el-button>
        <el-button plain size="small" @click="showComment = !showComment">
          <sk-icon type="sk-comment"/>评论
        </el-button>
        <el-button plain size="small">
          <sk-icon type="sk-add"/>添加到
        </el-button>
        <el-button plain size="small">
          <sk-icon type="sk-download"/>下载
        </el-button>
        <el-button plain size="small">
          <sk-icon type="sk-love"/>收藏
        </el-button>
        <el-button plain size="small">
          <sk-icon type="sk-edit"/>编辑
        </el-button>
      </div>
      <el-scrollbar v-if="!showComment" class="song-list">
        <el-table
            ref="multipleTable"
            :data="sheet.songList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="selectionChange">
          <el-table-column
              type="selection"
              width="55">
          </el-table-column>
          <el-table-column
              prop="name"
              label="歌名"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="signer"
              label="歌手"
              width="120">
          </el-table-column>
          <el-table-column
              prop="signer"
              label="专辑"
              width="120">
          </el-table-column>
          <el-table-column
              prop="time"
              label="时长"
              width="120">
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <el-scrollbar v-else class="comment-list">
        <el-input
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 6}"
            placeholder="快来留下你的足迹吧~"
            class="mt-4 text-base"
            v-model="commentText">
        </el-input>
        <div class="text-right mt-2">
          <el-button class="bg-theme-color text-white rounded-none" plain size="small">发表评论</el-button>
        </div>
        <div v-for="(comment, index) in sheet.comments" :key="index">
          <comment-item :comment="comment"/>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import CommentItem from '../../components/comment/CommentItem.vue';

export default {
  name       : 'SheetDetails',
  components : { CommentItem },
  data() {
    return {
      sheet : {
        name     : '静默如初',
        thumb    : 'http://p2.music.126.net/sn3gTr0VI38D8fFxbSLwEA==/19057835044867505.jpg',
        tags     : [ '安静', '古风', '轻吟浅唱' ],
        desc     : '松墨初上，笔落纸签若雪我写满了一袭香，小篆字两行，“成双花前影 月下恰正逢西厢”，你笑说我落笔匆忙，书翻到下一章，题“花摇印月影 春风剪菱窗”，云袖舞月光 何作沉璧湖心晃，暗来水殿凉 一一并举风荷香，南燕总北往 无论去何方，我一直陪在你身旁。',
        songList : [
          { name: '杏花弦外雨', signer: '银临', album: '腐草为萤', time: '03:42' },
          { name: '烟笼长安', signer: '少司命', album: '烟笼长安', time: '04:41' },
          { name: '我的一个道姑朋友', signer: '以冬', album: '黯然销魂', time: '04:08' },
          { name: '梅坞寻茶', signer: '少司命', album: '剑走偏锋', time: '03:54' },
          { name: '杏花弦外雨1', signer: '银临', album: '腐草为萤', time: '03:42' },
          { name: '烟笼长安1', signer: '少司命', album: '烟笼长安', time: '04:41' },
          { name: '我的一个道姑朋友1', signer: '以冬', album: '黯然销魂', time: '04:08' },
          { name: '梅坞寻茶1', signer: '少司命', album: '剑走偏锋', time: '03:54' },
          { name: '杏花弦外雨2', signer: '银临', album: '腐草为萤', time: '03:42' },
          { name: '烟笼长安2', signer: '少司命', album: '烟笼长安', time: '04:41' },
          { name: '我的一个道姑朋友2', signer: '以冬', album: '黯然销魂', time: '04:08' },
          { name: '梅坞寻茶2', signer: '少司命', album: '剑走偏锋', time: '03:54' },
        ],
        comments : [
          {
            user : {
              avatar : 'http://p2.music.126.net/sn3gTr0VI38D8fFxbSLwEA==/19057835044867505.jpg',
              name   : '安之若素',
              date   : '2018-01-12 12:23:08',
            },
            content : '这一世，你是我，遗忘千年的红颜知己，你是我，染尽了红尘，散尽了伤感的思念。缘起缘灭，擦肩而过，谁倾了我的城，我负了谁的心，从此，那一抹容颜遗忘天涯，了无相望。与你，错过一季，那是落花的时节。一身落红，裙袂飘飘，甩出柔情的水袖，恍若甩出千年的过往',
          },
          {
            user : {
              avatar : 'http://p2.music.126.net/sn3gTr0VI38D8fFxbSLwEA==/19057835044867505.jpg',
              name   : '安之若素',
              date   : '2018-01-12 12:23:08',
            },
            content : '这一世，你是我，遗忘千年的红颜知己，你是我，染尽了红尘，散尽了伤感的思念。缘起缘灭，擦肩而过，谁倾了我的城，我负了谁的心，从此，那一抹容颜遗忘天涯，了无相望。与你，错过一季，那是落花的时节。一身落红，裙袂飘飘，甩出柔情的水袖，恍若甩出千年的过往',
          },
          {
            user : {
              avatar : 'http://p2.music.126.net/sn3gTr0VI38D8fFxbSLwEA==/19057835044867505.jpg',
              name   : '安之若素',
              date   : '2018-01-12 12:23:08',
            },
            content : '这一世，你是我，遗忘千年的红颜知己，你是我，染尽了红尘，散尽了伤感的思念。缘起缘灭，擦肩而过，谁倾了我的城，我负了谁的心，从此，那一抹容颜遗忘天涯，了无相望。与你，错过一季，那是落花的时节。一身落红，裙袂飘飘，甩出柔情的水袖，恍若甩出千年的过往',
          },
          {
            user : {
              avatar : 'http://p2.music.126.net/sn3gTr0VI38D8fFxbSLwEA==/19057835044867505.jpg',
              name   : '安之若素',
              date   : '2018-01-12 12:23:08',
            },
            content : '这一世，你是我，遗忘千年的红颜知己，你是我，染尽了红尘，散尽了伤感的思念。缘起缘灭，擦肩而过，谁倾了我的城，我负了谁的心，从此，那一抹容颜遗忘天涯，了无相望。与你，错过一季，那是落花的时节。一身落红，裙袂飘飘，甩出柔情的水袖，恍若甩出千年的过往',
          },
        ],
      },
      showComment : false,
      commentText : '',
    };
  },
  methods : {
    selectionChange() {

    },
  },
};
</script>

<style lang="less">
#sheet-details {
  @apply flex flex-col h-full w-full flex-grow;
  .sheet-info {
      @apply flex;
    > img {
      width: 180px;
      height: 180px;
    }
    .name {
      @apply text-2xl text-black font-semibold;
    }
  }
  .controls {
    .el-button--small {
      padding: 6px 12px;
    }
    .el-button {
      @apply rounded-none;
      >span {
        @apply flex justify-center items-center;
        .sketch-icon {
          @apply mr-1 text-base;
        }
      }
    }
  }
  .song-list, .comment-list {
    @apply flex flex-grow flex-col h-1 bg-my-sheet mt-2;
    .el-scrollbar__wrap {
      @apply overflow-x-hidden px-4;
    }
  }
}
</style>
