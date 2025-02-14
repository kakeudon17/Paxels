import shutil
import os
import getpass

# 現在のユーザー名を取得
username = getpass.getuser()

# パスをユーザー名に応じて設定
path_old = f"./Paxels_BP"
path_new = f"C:/Users/{username}/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_behavior_packs/Paxels_BP"

if os.path.exists(path_new):
    shutil.rmtree(path_new)
shutil.copytree(path_old, path_new)

path_old = f"./Paxels_RP"
path_new = f"C:/Users/{username}/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/Paxels_RP"

if os.path.exists(path_new):
    shutil.rmtree(path_new)
shutil.copytree(path_old, path_new)
