// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Event as TauriEvent, Manager};
// use notify::{
//   recommended_watcher, Error, Event as NotifyEvent, EventKind, RecursiveMode, Watcher,
// };
// use std::sync::mpsc::channel;
// use std::thread;
use std::sync::{Arc, Mutex};
use serde_json;

mod file_watcher;

#[derive(Clone, serde::Serialize)]
struct Payload {
  event_type: String,
  path: String
}

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      // let (tx, rx) = channel::<Result<NotifyEvent, Error>>();
      // let watcher = Arc::new(Mutex::new(recommended_watcher(tx).unwrap()));
      // let watcher_unwatch = Arc::clone(&watcher);
      let handle = app.handle();
      let callback = move |event_type: &str, path:String| {
        let _ = handle.emit_all("watcher_emit", Payload {event_type: event_type.to_string(), path});
      };
      let watcher = Arc::new(Mutex::new(file_watcher::FileWatcher::create(callback)));
      let watcher_unwatch = Arc::clone(&watcher);
      // thread::spawn(move || {
      // tauri::async_runtime::spawn(async move {
      //   for event_ in rx {
      //       match event_ {
      //           Ok(event) => {
      //               let path = event.paths[0]
      //               .clone()
      //               .into_os_string()
      //               .into_string()
      //               .unwrap();
      //               match event.kind {
      //                   EventKind::Create(_) => {
      //                       let _ = handle.emit_all("watcher_emit", Payload {event_type: String::from("create"), path});
      //                   }
      //                   EventKind::Modify(_) => {
      //                       let _ = handle.emit_all("watcher_emit", Payload {event_type: String::from("modify"), path});
      //                   }
      //                   EventKind::Remove(_) => {
      //                       let _ = handle.emit_all("watcher_emit", Payload {event_type: String::from("Remove"), path});
      //                   }
      //                   _ => ()
      //               }
      //           }
      //           _ => (),
      //       }
      //   }
      // });
      app.listen_global("watch",  move |event: TauriEvent| {
        watcher.lock().unwrap().watch(serde_json::from_str(event.payload().unwrap()).unwrap());
      });
      app.listen_global("unwatch",  move |event: TauriEvent| {
        watcher_unwatch.lock().unwrap().unwatch(serde_json::from_str(event.payload().unwrap()).unwrap());
      });
      // app.listen_global("watch",  move |event: TauriEvent| {
      //   match watcher.lock().unwrap().watch(String::from(event.payload().unwrap()).as_ref(), RecursiveMode::NonRecursive)
      //   {
      //     Err(_) => {
      //         println!("すでにwatchされています");
      //     }
      //       Ok(_) => todo!(),
      //   }
      // });
      
      // app.listen_global("unwatch",  move |event: TauriEvent| {
      //   match watcher_unwatch.lock().unwrap().unwatch(String::from(event.payload().unwrap()).as_ref()) {
      //     Err(_) => {
      //         println!("すでにunwatchされています");
      //     }
      //     _ => (),
      // }
      // });
      
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
