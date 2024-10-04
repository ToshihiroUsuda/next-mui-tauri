use notify::{
    recommended_watcher, Error, Event, EventKind, RecommendedWatcher, RecursiveMode, Watcher,
};
use std::sync::mpsc::channel;
use std::thread;
use std::path::Path;

pub struct FileWatcher {
    watcher: RecommendedWatcher,
}

impl FileWatcher {
    pub fn create<F>(callback: F) -> Self where 
    F: Fn(&str, String) + Send + 'static
    {
        let (tx, rx) = channel::<Result<Event, Error>>();

        thread::spawn(move || {
            for event_ in rx {
                match event_ {
                    Ok(event) => {
                        match event.kind {
                            EventKind::Create(_) => {
                                let path = event.paths[0]
                                    .clone()
                                    .into_os_string()
                                    .into_string()
                                    .unwrap();
                                callback("create", path);
                                // ファイルが作成されたときの処理
                            }
                            EventKind::Modify(_) => {
                                let path = event.paths[0]
                                    .clone()
                                    .into_os_string()
                                    .into_string()
                                    .unwrap();
                                callback("modify", path);
                                // ファイルが変更されたときの処理
                            }
                            EventKind::Remove(_) => {
                                let path = event.paths[0]
                                    .clone()
                                    .into_os_string()
                                    .into_string()
                                    .unwrap();
                                callback("remove", path);
                                // ファイルが削除されたときの処理
                            }
                            _ => ()
                        }
                    }
                    _ => (),
                }
            }
        });
        Self {
            watcher: recommended_watcher(tx).unwrap(),
        }
    }

    pub fn watch(&mut self, path: String) {
        match self
            .watcher
            .watch(&Path::new(&path), RecursiveMode::NonRecursive)
        {
            Err(e) => {
                println!("watchに失敗しました: {}", Path::new(&path).display());
                println!("{}", e);
            }
            Ok(_) => println!("watch に成功: {}", path),
        }
    }

    pub fn unwatch(&mut self, path: String) {
        match self.watcher.unwatch(Path::new(&path)) {
            Err(_) => {
                println!("unwatchに失敗しました: {}", path);
            }
            Ok(_) => println!("unwatch に成功: {}", path),
        }
    }
}
