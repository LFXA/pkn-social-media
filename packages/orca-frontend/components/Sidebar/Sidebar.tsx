import { forwardRef, ForwardRefRenderFunction, useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UserRole } from '../../constants';
import { Button, ButtonLink, Divider, Modal, Spacing, Avatar } from '../ui';
import {
  PlusIcon,
  HouseColorfulIcon,
  PeopleColorfulIcon,
  NotificationColorfulIcon,
  MessageColorfulIcon,
  DragIcon,
} from '../ui/icons';
import { Root, UL, LI, ChannelName, DragButton } from './style';
import ChannelPopover from './ChannelPopover';
import { useRouter } from 'next/router';
import { RootState } from '../../store';
import axios from 'axios';
import ChannelCreate from '../Channel/ChannelCreate';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';

import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

interface SidebarProps {
  isOpen: boolean;
}

const fetchChannels = async () => {
  const { data } = await axios.get('/channels');
  return data;
};

const reorderChannels = async ({ sortedChannels }) => {
  const response = await axios.post('/channels/reorder', { sortedChannels });
  return response;
};

function SortableChannelItem({ channel, isAdmin, activeChannelName }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: channel._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  return (
    <LI ref={setNodeRef} style={style}>
      <ButtonLink
        fullWidth
        radius="none"
        href={`/channel/${channel.name}`}
        color="text"
        active={channel.name === activeChannelName}
        size="sm"
      >
        <ChannelName>{channel.name}</ChannelName>
      </ButtonLink>

      {isAdmin && (
        <Spacing right="xxs">
          <DragButton ghost tabIndex={-1} {...attributes} {...listeners}>
            <DragIcon />
          </DragButton>
        </Spacing>
      )}

      {isAdmin && <ChannelPopover channel={channel} />}
    </LI>
  );
}

const Sidebar: ForwardRefRenderFunction<HTMLDivElement, SidebarProps> = ({ isOpen }, ref) => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [modal, setModal] = useState(false);
  const closeModal = () => setModal(false);
  const router = useRouter();

  const { data: channels } = useQuery({
    queryKey: ['channels'],
    queryFn: fetchChannels,
  });
  const [channelItems, setChannelItems] = useState([]);
  const { mutateAsync: reorderChannelsMutation } = useMutation({ mutationFn: reorderChannels });
  const isAdmin = (authUser && authUser.role === UserRole.Admin) || (authUser && authUser.role === UserRole.SuperAdmin);

  useEffect(() => {
    if (channels) {
      setChannelItems(channels);
    }
  }, [channels]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = channelItems.findIndex((c) => c._id === active.id);
      const newIndex = channelItems.findIndex((c) => c._id === over.id);
      const newOrder = arrayMove(channelItems, oldIndex, newIndex);
      setChannelItems(newOrder);
      console.log('Clicked outside, closing popover');
      if (isAdmin) {
        await reorderChannelsMutation({ sortedChannels: newOrder });
      }
    }
  };
  return (
    <Root ref={ref} isOpen={isOpen}>
      <Modal title="Create Channel" isOpen={modal} close={closeModal}>
        <ChannelCreate closeModal={closeModal} channels={channelItems} />
      </Modal>

      <UL>
        {authUser && (
          <LI>
            <ButtonLink
              fullWidth
              radius="none"
              href={`/profile/${authUser._id}`}
              color="text"
              active={router.query?.id === authUser._id}
              size="sm"
            >
              <Avatar image={authUser?.pokeApiId ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${authUser?.pokeApiId}.png` : authUser?.image}  isActive={router.query?.id === authUser._id} />
              <Spacing right="xs" />
              {authUser.fullName}
            </ButtonLink>
          </LI>
        )}
        <LI>
          <ButtonLink fullWidth radius="none" href="/" color="text" active={router.pathname === '/'} size="sm">
            <HouseColorfulIcon color={router.pathname === '/' ? 'primary' : 'text'} />
            {'\u00A0'}
            {'\u00A0'} Home
          </ButtonLink>
        </LI>
        <LI>
          <ButtonLink
            fullWidth
            radius="none"
            href="/members"
            color="text"
            active={router.pathname === '/members'}
            size="sm"
          >
            <PeopleColorfulIcon color={router.pathname === '/members' ? 'primary' : 'text'} />
            {'\u00A0'}
            {'\u00A0'} Members
          </ButtonLink>
        </LI>

        <LI>
          <ButtonLink
            fullWidth
            radius="none"
            href="/notifications"
            color="text"
            active={router.pathname === '/notifications'}
            size="sm"
          >
            <NotificationColorfulIcon width="20" color={router.pathname === '/notifications' ? 'primary' : 'text'} />
            {'\u00A0'}
            {'\u00A0'} Notifications
          </ButtonLink>
        </LI>
        <LI>
          <ButtonLink
            fullWidth
            radius="none"
            href="/messages"
            color="text"
            active={router.pathname === '/messages'}
            size="sm"
          >
            <MessageColorfulIcon width="20" color={router.pathname === '/messages' ? 'primary' : 'text'} />
            {'\u00A0'}
            {'\u00A0'} Messages
          </ButtonLink>
        </LI>

        
      </UL>

      {channelItems?.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={channelItems.map((c) => c._id)} strategy={verticalListSortingStrategy}>
            <UL>
              {channelItems.map((channel) => (
                <SortableChannelItem
                  key={channel._id}
                  channel={channel}
                  isAdmin={isAdmin}
                  activeChannelName={router.query.name}
                />
              ))}
              <LI noHover>
             <Spacing top="sm" left="xs" />
              <Divider />
            </LI>
            </UL>
          </SortableContext>
        </DndContext>
        
      )}

      {isAdmin && (
        <Button size="xs" onClick={() => setModal(true)} textColor="text">
          <PlusIcon />
          {'\u00A0'}
          {'\u00A0'}
          Create Channel
        </Button>
      )}
    </Root>
  );
};

export default forwardRef(Sidebar);
