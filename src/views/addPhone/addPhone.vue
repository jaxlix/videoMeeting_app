<template>
    <div id="search">
        <Header title="添加电话" />
        <keyboard :letter="false" />
    </div>
</template>

<script>
import Header from "@/components/Header";
import keyboard from "@/components/keyboard/keyboard";

export default {
    data() {
        return {
        }
    },
    components: {
        Header,
        keyboard
    },
    methods: {
    },
    mounted(){
        
    }
};
</script>

<style lang="less" scoped>
#search {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 40px;
    box-sizing: border-box;
    color: #B5E5F0;
}
</style>