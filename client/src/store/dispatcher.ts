import { defineStore } from "pinia"
import { defineAsyncComponent } from "vue"
import { ICreateOptions } from "~/api"
import { changePassword, getInfo, login, changeUsername } from "~/api/auth"
import { IChangePasswordFormPayload } from "~/components/forms/interface"
import { getErrorId, getErrorMessage } from "~/errors"
import { IArticleIdentifier } from "~/interface"
import { isPost } from "~/utils/article"
import { useDetailStore } from "./detail"
import { useMainStore } from "./main"
import { useSettingsStore } from "./settings"

const HCreateArticleModal = defineAsyncComponent(
  () => import("@/modals/HCreateArticleModal.vue")
)
const HSettingsModal = defineAsyncComponent(
  () => import("@/modals/HSettingsModal.vue")
)

export const useDispatcher = defineStore("dispatcher", {
  state: () => ({}),
  actions: {
    init() {
      const mainStore = useMainStore()
      mainStore.loadUsername()
    },
    //#region user
    async getInfo() {
      return Promise.all([this.getUsername(), this.getSettings()])
    },
    async getSettings() {
      const settingsStore = useSettingsStore()
      await settingsStore.load()
    },
    async getUsername() {
      const mainStore = useMainStore()
      const { username } = await getInfo()
      mainStore.setUsername(username)
    },
    async signIn({
      username,
      password,
    }: {
      username: string
      password: string
    }) {
      try {
        await login(username, password)
        this.getInfo()
        this.router.push({ name: "home" })
      } catch (e) {
        this.notification.notify({
          title: "Login failed",
          type: "error",
        })
      }
    },
    async changePassword(payload: IChangePasswordFormPayload) {
      return changePassword(payload.oldPassword, payload.newPassword).then(
        () => {
          this.notification.notify({ type: "success", title: "Password change was successful" })
        },
        (err) => {
          this.notification.notify({
            title: "Password change was failed",
            desc: (err as Error).message,
            type: "error",
            duration: 5000,
          })
        }
      )
    },
    async changeUsername(username: string) {
      return changeUsername(username).then(
        () => {
          this.notification.notify({ type: "success", title: "Username change was successful" })
          return this.getUsername()
        },
        (err) => {
          this.notification.notify({
            title: "Username change was failed",
            desc: (err as Error).message,
            type: "error",
            duration: 5000,
          })
        }
      )
    },
    //#endregion
    //#region modals
    showCreateArticleModal() {
      this.modal.create(HCreateArticleModal)
    },
    showSettingsModal() {
      this.modal.create(HSettingsModal)
    },
    //#endregion
    async createArticle(title: string, options: ICreateOptions) {
      const mainStore = useMainStore()
      this.loading.start()
      try {
        await mainStore.createArticle(title, options).then(
          () => {
            this.notification.notify({
              type: "success",
              title: "Success to create",
            })
          },
          (err) => {
            this.notification.notify({
              title: "Fail to create",
              desc: (err as Error).message,
              type: "error",
              duration: 5000,
            })
          }
        )
      } catch (err) {
      } finally {
        this.loading.stop()
      }
    },
    deleteArticle(id: IArticleIdentifier) {
      const mainStore = useMainStore()
      this.dialog.create({
        type: "warning",
        title: "Confirm to delete",
        content: "Required to recover manually after deletion",
        actions: [
          { type: "common", label: "Cancel" },
          {
            type: "error",
            label: "Delete",
            run: () => {
              mainStore.deleteArticle(id.type, id.source).then(() => {
                this.notification.notify({
                  type: "success",
                  title: "Success to delete",
                })
                // FIXME 不是每次都要跳转
                this.router.push({ name: "home" })
              })
            },
          },
        ],
      })
    },
    async saveArticle(raw: string) {
      this.loading.start()
      try {
        const detailStore = useDetailStore()
        await detailStore.saveArticle(raw).then(
          () => {
            this.notification.notify({
              title: "Save successfully",
              type: "success",
            })
            this.reloadBlogData()
          },
          (err) => {
            this.notification.notify({
              title: "Save Failed",
              desc: (err as Error).message,
              type: "error",
              duration: 5000,
            })
            throw err
          }
        )
      } catch (err) {
      } finally {
        this.loading.stop()
      }
    },
    editArticle(id: IArticleIdentifier) {
      this.router.push({ name: "edit", params: { ...id } })
    },
    viewArticle(id: IArticleIdentifier) {
      this.router.push({ name: "view", params: { ...id } })
    },
    getArticle(id: IArticleIdentifier) {
      const detailStore = useDetailStore()
      detailStore.getArticle(id.type, id.source).catch((err) => {
        if (getErrorId(err) === "PostOrPageNotFoundError") {
          this.goHome()
        } else {
          this.notification.notify({
            title: "Loading failed",
            desc: getErrorMessage(err),
            type: "error",
            duration: 5000,
          })
        }
      })
    },
    clearArticle() {
      const detailStore = useDetailStore()
      detailStore.clearArticle()
    },
    async publishArticle(source: string) {
      this.dialog.create({
        type: "warning",
        title: "",
        content: "Required to recover manually after publishing",
        actions: [
          { type: "common", label: "Cancel" },
          {
            type: "info",
            label: "Publish",
            run: () => {
              this.doPublishArticle(source)
            },
          },
        ],
      })
    },
    async doPublishArticle(source: string) {
      const prefix = "_drafts/"
      if (!source.startsWith(prefix)) return
      this.loading.start()
      try {
        const removePrefixAndExt = (source: string) => {
          return source.slice(prefix.length, -3)
        }
        const mainStore = useMainStore()
        await mainStore.publishArticle(removePrefixAndExt(source)).then(
          (article) => {
            this.notification.notify({
              title: "Publish successfully",
              type: "success",
            })
            const detailStore = useDetailStore()
            if (
              detailStore.article &&
              isPost(detailStore.article) &&
              detailStore.article.source === source
            ) {
              this.router.push({
                name: "view",
                params: { source: article.source },
              })
            }
          },
          (err) => {
            this.notification.notify({
              title: "Publish failed",
              desc: (err as Error).message,
              type: "error",
              duration: 5000,
            })
          }
        )
      } catch (err) {
      } finally {
        this.loading.stop()
      }
    },
    goHome() {
      this.router.push({ name: "home" })
    },
    reloadBlogData() {
      const mainStore = useMainStore()
      mainStore.getBlogData().catch((err) => {
        this.notification.notify({
          title: `Fail to refresh blog data`,
          desc: (err as Error).message,
          type: "error",
          actions: [
            {
              label: "Retry",
              run: () => {
                this.reloadBlogData()
              },
            },
          ],
        })
      })
    },
    loadBlogData() {
      const mainStore = useMainStore()
      mainStore.getBlogData().catch((err) => {
        this.notification.notify({
          title: `Fail to loading blog data`,
          desc: (err as Error).message,
          type: "error",
          duration: 5000,
        })
      })
    },
  },
})
