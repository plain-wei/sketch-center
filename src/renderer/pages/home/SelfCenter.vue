<template>
  <div id="self-center">
    <div class="flex p-4 items-center">
      <user-avatar :size="108"/>
      <div class="self-details">
        <div class="py-2">
          <span class="name text-black text-2xl">{{userInfo.name}}</span>
          <span class="level ml-4">{{userInfo.level}}</span>
        </div>
        <span class="py-1 signature">
          <span class="text-black6">个人介绍:</span> {{userInfo.signature}}
        </span>
        <span class="py-1 address">
          <span class="text-black6">所在地区:</span> {{userInfo.address}}
        </span>
      </div>
      <div class="operation">
        <div class="edit text-sm cursor-pointer hover:text-theme-color">
          <i class="el-icon-edit"></i>
          <span class="ml-1">编辑信息</span>
        </div>
      </div>
    </div>
    <div class="music-sheet">
      <div class="sheet-title px-4 h-8 flex items-center">
        <span>我的歌单</span>
      </div>
      <el-scrollbar class="sheet-content">
        <sheet-item v-for="(sheet, index) in sheetList"
                    :key="index"
                    :sheet="sheet"/>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import UserAvatar from '../../components/sidebar/UserAvatar.vue';
import SheetItem from '../../components/sheet/SheetItem.vue';

export default {
  name       : 'SelfCenter',
  components : {
    UserAvatar,
    SheetItem,
  },
  data() {
    return {
      userInfo : {
        name      : '未思',
        signature : '半度清夏半度凉，一抹斜阳一晨光。',
        address   : '中国厦门',
        level     : 'Lv.8',
      },
      sheetList : [
        {
          name       : '我的收藏',
          thumb      : 'http://img1.kuwo.cn/star/userpl2015/shoujigd/precision/236290635_auto_150.jpg',
          songNumber : 8,
        },
        {
          name       : '静默如初',
          thumb      : 'http://p2.music.126.net/sn3gTr0VI38D8fFxbSLwEA==/19057835044867505.jpg',
          songNumber : 8,
        },
        {
          name       : '安之若素',
          thumb      : 'http://img4.kwcdn.kuwo.cn/star/userpl2015/shoujigd/random/3276_auto_150.jpg',
          songNumber : 3,
        },
        {
          name       : '轻吟浅唱，去拥抱一夏天的风，一夏天的风',
          thumb      : 'http://img2.kwcdn.kuwo.cn/star/userpl2015/shoujigd/dianzi/303328342_auto_150.jpg',
          songNumber : 12,
        },
        {
          name       : '古风一曲 动人心弦',
          thumb      : 'http://p2.music.126.net/3LiticA0jSwFL_oxKEHopA==/109951163546285535.jpg',
          songNumber : 14,
        },
      ],
    };
  },
};
</script>

<style lang="less">
#self-center {
  @apply flex flex-col flex-grow h-full;
  .self-details {
    @apply flex flex-col flex-grow w-1 px-4 justify-around text-sm text-black8;
  }
  .operation {
    @apply flex self-end text-black6;
  }
  .music-sheet {
    @apply bg-my-sheet flex flex-col flex-grow h-1;
    .sheet-content {
      @apply flex flex-grow;
      .el-scrollbar__wrap {
        overflow-x: hidden;
        overflow-y: auto;
      }
      .el-scrollbar__view {
        box-sizing: content-box;
        @apply flex flex-grow flex-wrap p-2;
      }
      .el-scrollbar__view:after{
        content: '';
        width: 30%;
        border:1px solid transparent;
      }
      .sheet-item {
        @apply m-2;
      }
    }
  }
}
</style>
